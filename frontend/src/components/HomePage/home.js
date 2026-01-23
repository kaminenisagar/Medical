import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, FaChartBar, FaSignOutAlt, FaHospital, 
  FaQrcode, FaMoneyBillWave, FaUsers, FaCheckCircle, 
  FaMoneyCheckAlt, FaHistory, FaNotesMedical, FaPrint, FaTimes, FaCalendarAlt,
  FaEye, FaFileInvoiceDollar, FaStethoscope, FaProcedures, FaXRay, FaUserCheck,
  FaClipboardCheck, FaFileMedicalAlt, FaClipboardList, FaMoneyBill, FaUserInjured,
  FaReceipt, FaPills, FaSyringe, FaHeartbeat, FaFilePdf, FaDownload, FaIdCard,
  FaEdit, FaTrash, FaLock, FaUnlock, FaClock, FaCalendar, FaCheckSquare,
  FaExclamationTriangle, FaThumbsUp, FaStar, FaBed, FaClipboard, FaBell,
  FaBellSlash, FaVolumeUp, FaVolumeMute, FaCalendarDay, FaCalendarCheck,
  FaUserClock, FaUserPlus, FaArrowRight, FaCalendarPlus
} from 'react-icons/fa';
import './home.css';

function App() {
  // Navigation & Role States
  const [role, setRole] = useState('accounts');
  const [view, setView] = useState('list');
  
  // Data States
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem('hospitalPatients');
    return savedPatients ? JSON.parse(savedPatients) : [];
  });
  
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('hospitalTransactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  
  // Auth States
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutTarget, setLogoutTarget] = useState(null);

  // UI States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentType, setPaymentType] = useState('cash');
  const [processingPatient, setProcessingPatient] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    age: '', 
    village: '', 
    phone: '', 
    problem: '' 
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);
  const [patientHistoryModal, setPatientHistoryModal] = useState(null);
  const [showMedicalReportModal, setShowMedicalReportModal] = useState(null);
  const [editHistoryIndex, setEditHistoryIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Notification States
  const [notification, setNotification] = useState(null);
  const [newPatientAlert, setNewPatientAlert] = useState(false);
  const [patientCompletedAlert, setPatientCompletedAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // UPI Payment State
  const [upiUTR, setUpiUTR] = useState('');
  
  // Treatment State
  const [treatment, setTreatment] = useState({ 
    diagnosis: '',
    healthAdvice: '',
    medicines: '',
    labTests: '',
    condition: 'Stable',
    selectedCondition: 'Stable',
    needsOperation: 'no',
    opAmount: 0,
    opStatus: 'Successful',
    nextVisitDate: '',
    nextVisitRequired: 'yes',
    scanningRequired: false,
    scanningType: '',
    scanningCost: 0,
    extraCharges: 0,
    treatmentStatus: 'Treatment Not Completed'
  });

  // Conditions dropdown options with icons
  const conditionOptions = [
    { value: 'Critical', label: '🚨 Critical - Immediate Attention', icon: <FaExclamationTriangle /> },
    { value: 'Serious', label: '⚠️ Serious - Close Monitoring', icon: <FaBed /> },
    { value: 'Stable', label: '✅ Stable - Regular Care', icon: <FaThumbsUp /> },
    { value: 'Good', label: '👍 Good - Minor Issues', icon: <FaCheckSquare /> },
    { value: 'Excellent', label: '🌟 Excellent - Recovery Complete', icon: <FaStar /> }
  ];

  // Treatment Status options
  const treatmentStatusOptions = [
    { value: 'Treatment Not Completed', label: 'Treatment Not Completed' },
    { value: 'Treatment Completed', label: 'Treatment Completed' }
  ];

  // Scanning types dropdown options
  const scanningOptions = [
    { value: '', label: 'No Scanning Required' },
    { value: 'X-Ray', label: 'X-Ray - ₹500' },
    { value: 'CT-Scan', label: 'CT Scan - ₹2000' },
    { value: 'MRI', label: 'MRI - ₹4000' },
    { value: 'Ultrasound', label: 'Ultrasound - ₹800' },
    { value: 'Blood-Test', label: 'Blood Test - ₹300' },
    { value: 'ECG', label: 'ECG - ₹400' }
  ];

  // Operation status options
  const opStatusOptions = [
    { value: 'Successful', label: '✅ Successful' },
    { value: 'Pending', label: '⏳ Pending' },
    { value: 'Failed', label: '❌ Failed' }
  ];

  // Payment method options
  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: <FaMoneyBillWave /> },
    { value: 'upi', label: 'UPI', icon: <FaQrcode /> }
  ];

  // Doctor statistics
  const [doctorStats, setDoctorStats] = useState({
    totalPatientsSeen: 0,
    operationsPerformed: 0,
    scansPrescribed: 0,
    todayPatients: 0,
    pendingCheckups: 0,
    completedCheckups: 0,
    todayVisits: 0,
    upcomingVisits: 0
  });

  // Admin dashboard stats
  const [adminStats, setAdminStats] = useState({
    totalPendingAmount: 0,
    completedCheckups: 0,
    pendingCheckups: 0,
    todayRevenue: 0,
    totalPatients: 0,
    todayVisits: 0
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hospitalPatients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hospitalTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Generate transaction ID
  const generateTransactionId = (method) => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    let prefix = '';
    switch(method) {
      case 'cash': prefix = 'CASH'; break;
      case 'upi': prefix = 'UPI'; break;
      default: prefix = 'TXN';
    }
    
    return `${prefix}-${timestamp}${random}`;
  };

  const getTodayDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date is today
  const isToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return dateString === today;
  };

  // Get today's date for date input
  const getTodayInputDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format currency (Indian Rupees)
  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || 0}`;
  };

  // Update doctor statistics
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const todayInput = getTodayInputDate();
    
    // Get patients with next visit today
    const todayVisitPatients = patients.filter(p => {
      if (!p.nextVisit || p.nextVisit === 'Not Required' || p.nextVisit === 'Not Assigned') return false;
      return isToday(p.nextVisit);
    });

    // Get upcoming visits (future dates)
    const upcomingVisitPatients = patients.filter(p => {
      if (!p.nextVisit || p.nextVisit === 'Not Required' || p.nextVisit === 'Not Assigned') return false;
      const nextVisitDate = new Date(p.nextVisit.split('-').reverse().join('-'));
      const today = new Date();
      return nextVisitDate > today;
    });

    const stats = {
      totalPatientsSeen: patients.filter(p => p.seenByDoctor).length,
      operationsPerformed: patients.filter(p => p.status.includes('Operation')).length,
      scansPrescribed: patients.filter(p => p.scanningRequired).length,
      todayPatients: patients.filter(p => p.lastVisitDate === today).length,
      pendingCheckups: patients.filter(p => p.status === 'Awaiting Doctor' || p.status === 'Payment Pending').length,
      completedCheckups: patients.filter(p => p.status === 'Treatment Completed' || p.condition === 'Excellent' || p.condition === 'Good').length,
      todayVisits: todayVisitPatients.length,
      upcomingVisits: upcomingVisitPatients.length
    };
    setDoctorStats(stats);
  }, [patients]);

  // Update admin statistics
  useEffect(() => {
    const calculatePatientPending = (patient) => {
      const totalCharges = 200 + (patient.opAmount || 0) + (patient.extraCharges || 0) + (patient.scanningCost || 0);
      const totalPaid = patient.totalPaid || 0;
      return Math.max(0, totalCharges - totalPaid);
    };

    const todayVisitPatients = patients.filter(p => 
      p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit)
    );

    const stats = {
      totalPendingAmount: patients.reduce((sum, p) => sum + calculatePatientPending(p), 0),
      completedCheckups: patients.filter(p => 
        p.status.includes('Completed') || 
        p.condition === 'Excellent' || 
        p.condition === 'Good'
      ).length,
      pendingCheckups: patients.filter(p => 
        p.status === 'Awaiting Doctor' || 
        p.status === 'Payment Pending' ||
        p.status === 'Awaiting Op Payment' ||
        p.status === 'Awaiting Scan Payment'
      ).length,
      todayRevenue: transactions
        .filter(t => t.date === getTodayDate())
        .reduce((sum, t) => sum + t.amount, 0),
      totalPatients: patients.length,
      todayVisits: todayVisitPatients.length
    };
    setAdminStats(stats);
  }, [patients, transactions]);

  // Check for new patients from accounts to doctor
  useEffect(() => {
    const newPatients = patients.filter(p => 
      p.status === 'Awaiting Doctor' && 
      !p.seenByDoctor
    );
    
    if (newPatients.length > 0 && role === 'doctor') {
      setNewPatientAlert(true);
      showNotification(`${newPatients.length} new patient(s) awaiting doctor`, 'info');
    } else {
      setNewPatientAlert(false);
    }
  }, [patients, role]);

  // Check for completed treatments
  useEffect(() => {
    const completedPatients = patients.filter(p => 
      (p.status === 'Treatment Completed' || p.status === 'Operation Payment Completed' || p.status === 'Scanning Payment Completed') &&
      role === 'accounts'
    );
    
    if (completedPatients.length > 0) {
      setPatientCompletedAlert(true);
    } else {
      setPatientCompletedAlert(false);
    }
  }, [patients, role]);

  // Check for today's visits
  useEffect(() => {
    const todayVisitPatients = patients.filter(p => 
      p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit)
    );
    
    if (todayVisitPatients.length > 0 && (role === 'doctor' || role === 'accounts')) {
      if (role === 'doctor') {
        showNotification(`${todayVisitPatients.length} patient(s) have scheduled visits today`, 'info');
      } else if (role === 'accounts') {
        showNotification(`${todayVisitPatients.length} patient(s) expected today for follow-up`, 'info');
      }
    }
  }, [patients, role]);

  // Update scanning cost when type changes
  useEffect(() => {
    const scanningCosts = {
      'X-Ray': 500,
      'CT-Scan': 2000,
      'MRI': 4000,
      'Ultrasound': 800,
      'Blood-Test': 300,
      'ECG': 400
    };
    
    if (treatment.scanningType && scanningCosts[treatment.scanningType]) {
      setTreatment(prev => ({
        ...prev,
        scanningCost: scanningCosts[treatment.scanningType]
      }));
    } else {
      setTreatment(prev => ({
        ...prev,
        scanningCost: 0
      }));
    }
  }, [treatment.scanningType]);

  // Remove scanning when next visit is set to 'no'
  useEffect(() => {
    if (treatment.nextVisitRequired === 'no') {
      setTreatment(prev => ({
        ...prev,
        scanningRequired: false,
        scanningType: '',
        scanningCost: 0
      }));
    }
  }, [treatment.nextVisitRequired]);

  // --- LOGOUT LOGIC ---
  const handleLogout = (target) => {
    setLogoutTarget(target);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    if (logoutTarget === 'admin') {
      setIsAdminLoggedIn(false);
      setRole('accounts');
      setAdminCreds({ username: '', password: '' });
      localStorage.removeItem('adminLoggedIn');
    } else if (logoutTarget === 'sidebar') {
      localStorage.removeItem('user');
      window.location.href = '/';
     return;
    }
    
    setShowLogoutModal(false);
    setLogoutTarget(null);
  };

  // --- PRINT LOGIC ---
  const handlePrint = (txn) => {
    setSelectedReceipt(txn);
    setShowPrintModal(true);
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  // Print Medical Report
  const printMedicalReport = (patient) => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Report - ${patient.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .hospital-name { font-size: 24px; font-weight: bold; color: #1e40af; }
          .patient-info { margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; }
          .section { margin-bottom: 20px; }
          .section-title { background: #f3f4f6; padding: 8px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .treatment-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .treatment-table th, .treatment-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .treatment-table th { background-color: #f3f4f6; }
          .treatment-table tr:nth-child(even) { background-color: #f9f9f9; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">MEDICARE PRO HOSPITAL</div>
          <div>123 Health Street, City Center • Phone: 9876543210</div>
          <h2>COMPLETE MEDICAL REPORT</h2>
        </div>
        
        <div class="patient-info">
          <h3>PATIENT INFORMATION</h3>
          <div class="summary-grid">
            <div><strong>Name:</strong> ${patient.name}</div>
            <div><strong>Age:</strong> ${patient.age} years</div>
            <div><strong>Village:</strong> ${patient.village}</div>
            <div><strong>Phone:</strong> ${patient.phone}</div>
            <div><strong>Registration Date:</strong> ${patient.date}</div>
            <div><strong>Current Condition:</strong> ${patient.condition}</div>
            <div><strong>Treatment Status:</strong> ${patient.treatmentStatus || 'Not Completed'}</div>
            <div><strong>Next Visit:</strong> ${patient.nextVisit}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">TREATMENT HISTORY</div>
          ${patient.history && patient.history.length > 0 ? `
            <table class="treatment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Diagnosis</th>
                  <th>Health Advice</th>
                  <th>Medicines</th>
                  <th>Condition</th>
                  <th>Treatment Status</th>
                </tr>
              </thead>
              <tbody>
                ${patient.history.map((h, index) => `
                  <tr>
                    <td>${h.date}</td>
                    <td>${h.diagnosis || 'N/A'}</td>
                    <td>${h.healthAdvice || 'N/A'}</td>
                    <td>${h.medicines || 'N/A'}</td>
                    <td>${h.condition}</td>
                    <td>${h.treatmentStatus || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>No treatment history available.</p>'}
        </div>
        
        <div class="section">
          <div class="section-title">FINANCIAL SUMMARY</div>
          <div class="summary-grid">
            <div class="summary-card">
              <strong>Registration Fee:</strong> ₹200
            </div>
            <div class="summary-card">
              <strong>Operation Charges:</strong> ₹${patient.opAmount || 0}
            </div>
            <div class="summary-card">
              <strong>Scanning Charges:</strong> ₹${patient.scanningCost || 0}
            </div>
            <div class="summary-card">
              <strong>Service Charges:</strong> ₹${patient.extraCharges || 0}
            </div>
            <div class="summary-card">
              <strong>Total Charges:</strong> ₹${200 + (patient.opAmount || 0) + (patient.scanningCost || 0) + (patient.extraCharges || 0)}
            </div>
            <div class="summary-card">
              <strong>Amount Paid:</strong> ₹${patient.totalPaid || 0}
            </div>
            <div class="summary-card">
              <strong>Pending Amount:</strong> ₹${Math.max(0, (200 + (patient.opAmount || 0) + (patient.scanningCost || 0) + (patient.extraCharges || 0)) - (patient.totalPaid || 0))}
            </div>
            <div class="summary-card">
              <strong>Payment Status:</strong> ${patient.totalPaid >= (200 + (patient.opAmount || 0) + (patient.scanningCost || 0) + (patient.extraCharges || 0)) ? 'Paid' : 'Pending'}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated report. Signature not required.</p>
          <p>Report Generated on: ${new Date().toLocaleDateString()}</p>
          <p>© Medicare Pro Hospital - Confidential Medical Document</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()">Print Report</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // --- AUTH LOGIC ---
  const handleRoleChange = (newRole) => {
    if (newRole === 'admin' && !isAdminLoggedIn) {
      setShowAdminLogin(true);
    } else {
      setRole(newRole);
      setView('list');
      
      // Show notification when switching roles
      if (newRole === 'doctor') {
        const newPatients = patients.filter(p => p.status === 'Awaiting Doctor');
        if (newPatients.length > 0) {
          showNotification(`${newPatients.length} patient(s) awaiting doctor checkup`, 'info');
        }
        
        // Check for today's visits
        const todayVisits = patients.filter(p => 
          p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit)
        );
        if (todayVisits.length > 0) {
          showNotification(`${todayVisits.length} patient(s) scheduled for visit today`, 'info');
        }
      } else if (newRole === 'accounts') {
        const pendingPayments = patients.filter(p => 
          p.status === 'Payment Pending' || 
          p.status === 'Awaiting Op Payment' || 
          p.status === 'Awaiting Scan Payment'
        );
        if (pendingPayments.length > 0) {
          showNotification(`${pendingPayments.length} patient(s) with pending payments`, 'info');
        }
        
        // Check for today's visits
        const todayVisits = patients.filter(p => 
          p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit)
        );
        if (todayVisits.length > 0) {
          showNotification(`${todayVisits.length} patient(s) expected today for follow-up`, 'info');
        }
      }
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCreds.username === 'admin' && adminCreds.password === '123456') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setRole('admin');
      localStorage.setItem('adminLoggedIn', 'true');
      showNotification('Admin login successful', 'success');
    } else {
      alert("Invalid Admin Credentials!");
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // --- DELETE PATIENT LOGIC ---
  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? All related data will be permanently removed.')) {
      // Remove patient
      const patientToDelete = patients.find(p => p.id === patientId);
      setPatients(prev => prev.filter(p => p.id !== patientId));
      
      // Remove related transactions
      if (patientToDelete) {
        setTransactions(prev => prev.filter(t => t.patientName !== patientToDelete.name));
      }
      
      showNotification('Patient deleted successfully', 'success');
    }
  };

  // --- PAYMENT LOGIC ---
  const openPaymentModal = (patientData, isInitial = true, isOpCharge = false, isScanCharge = false, isServiceCharge = false) => {
    let amount = 0;
    
    if (isInitial) {
      amount = 200;
    } else if (isOpCharge) {
      amount = patientData.opAmount - (patientData.opAmountPaid || 0);
    } else if (isScanCharge) {
      amount = patientData.scanningCost - (patientData.scanPaid || 0);
    } else if (isServiceCharge) {
      amount = patientData.extraCharges - (patientData.extraPaid || 0);
    }
    
    setProcessingPatient({ 
      ...patientData, 
      isInitial, 
      isOpCharge,
      isScanCharge,
      isServiceCharge,
      amount: Math.max(0, amount)
    });
    setPaymentType('cash');
    setUpiUTR('');
    setShowPaymentModal(true);
  };

  const finalizePayment = () => {
    if (paymentType === 'upi' && !upiUTR.trim()) {
      alert('Please enter UTR number for UPI payment');
      return;
    }

    if (paymentType === 'upi' && upiUTR.length < 10) {
      alert('Please enter a valid UTR number (minimum 10 characters)');
      return;
    }

    const today = getTodayDate();
    const amountPaid = parseInt(processingPatient.amount) || 0;
    
    let paymentTypeLabel = 'Registration';
    if (processingPatient.isOpCharge) paymentTypeLabel = 'Operation';
    else if (processingPatient.isScanCharge) paymentTypeLabel = 'Scanning';
    else if (processingPatient.isServiceCharge) paymentTypeLabel = 'Service Charges';
    
    const transactionId = generateTransactionId(paymentType);
    
    const newTransaction = {
      id: transactionId,
      patientId: processingPatient.id,
      patientName: processingPatient.name,
      amount: amountPaid,
      type: paymentTypeLabel,
      method: paymentType,
      date: today,
      timestamp: Date.now(),
      utrNumber: paymentType === 'upi' ? upiUTR : null
    };
    
    setTransactions([newTransaction, ...transactions]);

    setPatients(prev => {
      if (processingPatient.isInitial) {
        const newPatient = {
          ...processingPatient,
          id: Date.now(),
          regFee: 200,
          opAmount: 0,
          opAmountPaid: 0,
          extraCharges: 0,
          extraPaid: 0,
          scanningCost: 0,
          scanPaid: 0,
          status: 'Awaiting Doctor',
          totalPaid: 200,
          history: [],
          date: today,
          nextVisit: 'Not Assigned',
          seenByDoctor: false,
          scanningRequired: false,
          scanningType: '',
          condition: 'Pending',
          treatmentStatus: 'Treatment Not Completed'
        };
        
        showNotification(`New patient ${processingPatient.name} registered successfully!`, 'success');
        
        return [newPatient, ...prev];
      } else {
        return prev.map(p => {
          if (p.id === processingPatient.id) {
            let newStatus = p.status;
            let newTotalPaid = (p.totalPaid || 0) + amountPaid;
            let newOpAmountPaid = p.opAmountPaid || 0;
            let newExtraPaid = p.extraPaid || 0;
            let newScanPaid = p.scanPaid || 0;
            
            if (processingPatient.isOpCharge) {
              newOpAmountPaid += amountPaid;
              if (newOpAmountPaid >= p.opAmount) {
                newStatus = 'Operation Payment Completed';
                showNotification(`Operation payment completed for ${p.name}`, 'success');
              } else {
                newStatus = 'Awaiting Op Payment';
              }
            } else if (processingPatient.isScanCharge) {
              newScanPaid += amountPaid;
              if (newScanPaid >= p.scanningCost) {
                newStatus = 'Scanning Payment Completed';
                showNotification(`Scanning payment completed for ${p.name}`, 'success');
              } else {
                newStatus = 'Awaiting Scan Payment';
              }
            } else if (processingPatient.isServiceCharge) {
              newExtraPaid += amountPaid;
              if (newExtraPaid >= p.extraCharges) {
                newStatus = 'Service Payment Completed';
                showNotification(`Service payment completed for ${p.name}`, 'success');
              } else {
                newStatus = 'Awaiting Service Payment';
              }
            }
            
            // Check if all payments are complete
            const totalCharges = 200 + (p.opAmount || 0) + (p.extraCharges || 0) + (p.scanningCost || 0);
            
            // If all payments are complete, update status to "Payment Completed"
            if (newTotalPaid >= totalCharges) {
              newStatus = 'Payment Completed';
              showNotification(`All payments completed for ${p.name}`, 'success');
            }
            
            // If treatment is already completed by doctor, don't change status
            if (p.treatmentStatus === 'Treatment Completed' || p.status === 'Treatment Completed') {
              newStatus = 'Treatment Completed';
            }
            
            return { 
              ...p, 
              status: newStatus,
              opAmountPaid: newOpAmountPaid,
              extraPaid: newExtraPaid,
              scanPaid: newScanPaid,
              totalPaid: newTotalPaid
            };
          }
          return p;
        });
      }
    });

    setShowPaymentModal(false);
    setUpiUTR('');
    setView('list');
    if (processingPatient.isInitial) {
      setFormData({ name: '', age: '', village: '', phone: '', problem: '' });
    }
  };

  // --- DOCTOR TREATMENT LOGIC ---
  const handleTreatmentSubmit = (e) => {
    e.preventDefault();
    const selectedCondition = treatment.selectedCondition;
    
    // Reset all charges if condition is Good or Excellent
    if (selectedCondition === 'Good' || selectedCondition === 'Excellent') {
      setTreatment(prev => ({
        ...prev,
        scanningType: '',
        scanningRequired: false,
        scanningCost: 0,
        needsOperation: 'no',
        opAmount: 0,
        extraCharges: 0
      }));
    }
    
    // If next visit is 'no', remove scanning
    const scanningType = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? '' : treatment.scanningType;
    const scanningCost = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? 0 : treatment.scanningCost;
    const scanningRequired = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? false : treatment.scanningRequired;
    const needsOperation = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? false : treatment.needsOperation === 'yes';
    const opAmount = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? 0 : (treatment.needsOperation === 'yes' ? parseInt(treatment.opAmount || 0) : 0);
    const extraCharges = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? 0 : parseInt(treatment.extraCharges || 0);
    const nextVisitDate = treatment.nextVisitRequired === 'yes' ? getFormattedDate(treatment.nextVisitDate) : 'Not Required';
    
    const totalCharges = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') ? 0 : (
      extraCharges + 
      opAmount + 
      parseInt(scanningCost || 0)
    );
    
    // SET STATUS BASED ON TREATMENT STATUS
    let newStatus = '';
    let finalTreatmentStatus = treatment.treatmentStatus;
    
    // If condition is Good or Excellent, treatment is automatically completed
    if (selectedCondition === 'Good' || selectedCondition === 'Excellent') {
      newStatus = 'Treatment Completed';
      finalTreatmentStatus = 'Treatment Completed';
    } 
    // If doctor manually selects Treatment Completed
    else if (treatment.treatmentStatus === 'Treatment Completed') {
      newStatus = 'Treatment Completed';
    }
    // If operation is needed
    else if (needsOperation) {
      newStatus = 'Awaiting Op Payment';
    } 
    // If scanning is needed
    else if (scanningRequired && scanningType) {
      newStatus = 'Awaiting Scan Payment';
    } 
    // Default case
    else {
      newStatus = 'Payment Pending';
    }
    
    const newHistoryEntry = {
      date: getTodayDate(),
      diagnosis: treatment.diagnosis,
      healthAdvice: treatment.healthAdvice,
      medicines: treatment.medicines,
      labTests: treatment.labTests,
      condition: selectedCondition,
      treatmentStatus: finalTreatmentStatus,
      nextVisit: nextVisitDate,
      type: needsOperation ? `Operation (${treatment.opStatus})` : 
            scanningRequired ? `Scanning (${scanningType})` : 
            "General Checkup",
      charges: totalCharges,
      scanningType: scanningType,
      scanningCost: scanningCost,
      opAmount: opAmount,
      opStatus: treatment.opStatus,
      extraCharges: extraCharges
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        const updatedPatient = {
          ...p,
          condition: selectedCondition,
          treatmentStatus: finalTreatmentStatus,
          extraCharges: extraCharges,
          opAmount: opAmount,
          scanningRequired: scanningRequired,
          scanningType: scanningType,
          scanningCost: scanningCost,
          nextVisit: nextVisitDate,
          status: newStatus,
          seenByDoctor: true,
          lastVisitDate: getTodayDate(),
          history: [newHistoryEntry, ...(p.history || [])],
          opAmountPaid: p.opAmountPaid || 0,
          extraPaid: p.extraPaid || 0,
          scanPaid: p.scanPaid || 0,
          totalPaid: p.totalPaid || 0
        };
        
        if (newStatus === 'Treatment Completed') {
          showNotification(`Treatment completed for ${p.name}. Patient marked as ${selectedCondition}.`, 'success');
        } else if (needsOperation) {
          showNotification(`Operation prescribed for ${p.name}. Sent to accounts for payment.`, 'info');
        } else if (scanningRequired) {
          showNotification(`Scanning prescribed for ${p.name}. Sent to accounts for payment.`, 'info');
        } else {
          showNotification(`Treatment recorded for ${p.name}. Sent to accounts for payment.`, 'info');
        }
        
        return updatedPatient;
      }
      return p;
    }));

    setTreatment({ 
      diagnosis: '',
      healthAdvice: '',
      medicines: '',
      labTests: '',
      condition: 'Stable',
      selectedCondition: 'Stable',
      needsOperation: 'no',
      opAmount: 0,
      opStatus: 'Successful',
      nextVisitDate: '',
      nextVisitRequired: 'yes',
      scanningRequired: false,
      scanningType: '',
      scanningCost: 0,
      extraCharges: 0,
      treatmentStatus: 'Treatment Not Completed'
    });
    
    setSelectedPatient(null);
    setView('list');
  };

  // Edit treatment history
  const handleEditHistory = (patient, historyIndex) => {
    const historyEntry = patient.history[historyIndex];
    
    setSelectedPatient(patient);
    setEditHistoryIndex(historyIndex);
    setView('treat');
    
    setTreatment({
      diagnosis: historyEntry.diagnosis || '',
      healthAdvice: historyEntry.healthAdvice || '',
      medicines: historyEntry.medicines || '',
      labTests: historyEntry.labTests || '',
      condition: 'Stable',
      selectedCondition: historyEntry.condition || 'Stable',
      needsOperation: historyEntry.opAmount > 0 ? 'yes' : 'no',
      opAmount: historyEntry.opAmount || 0,
      opStatus: historyEntry.opStatus || 'Successful',
      nextVisitDate: historyEntry.nextVisit === 'Not Required' ? '' : getDateForInput(historyEntry.nextVisit),
      nextVisitRequired: historyEntry.nextVisit === 'Not Required' ? 'no' : 'yes',
      scanningRequired: !!historyEntry.scanningType,
      scanningType: historyEntry.scanningType || '',
      scanningCost: historyEntry.scanningCost || 0,
      extraCharges: historyEntry.extraCharges || 0,
      treatmentStatus: historyEntry.treatmentStatus || 'Treatment Not Completed'
    });
  };

  // Delete treatment history
  const handleDeleteHistory = (patientId, historyIndex) => {
    if (window.confirm('Are you sure you want to delete this treatment record?')) {
      setPatients(prev => prev.map(p => {
        if (p.id === patientId) {
          const updatedHistory = [...p.history];
          updatedHistory.splice(historyIndex, 1);
          
          // Update patient condition to the most recent history entry if available
          let newCondition = p.condition;
          let newStatus = p.status;
          let newTreatmentStatus = p.treatmentStatus;
          let newNextVisit = p.nextVisit;
          
          if (updatedHistory.length > 0) {
            const latestHistory = updatedHistory[0];
            newCondition = latestHistory.condition;
            newTreatmentStatus = latestHistory.treatmentStatus;
            newNextVisit = latestHistory.nextVisit;
            
            // Update status based on condition
            if (newCondition === 'Good' || newCondition === 'Excellent' || newTreatmentStatus === 'Treatment Completed') {
              newStatus = 'Treatment Completed';
            } else if (p.totalPaid >= (200 + (p.opAmount || 0) + (p.extraCharges || 0) + (p.scanningCost || 0))) {
              newStatus = 'Payment Completed';
            } else {
              newStatus = 'Payment Pending';
            }
          } else {
            newCondition = 'Pending';
            newStatus = 'Awaiting Doctor';
            newTreatmentStatus = 'Treatment Not Completed';
            newNextVisit = 'Not Assigned';
          }
          
          return {
            ...p,
            history: updatedHistory,
            condition: newCondition,
            status: newStatus,
            treatmentStatus: newTreatmentStatus,
            nextVisit: newNextVisit
          };
        }
        return p;
      }));
      showNotification('Treatment record deleted successfully', 'success');
    }
  };

  // Update treatment history
  const handleUpdateTreatment = (e) => {
    e.preventDefault();
    const selectedCondition = treatment.selectedCondition;
    
    // Reset all charges if condition is Good or Excellent
    if (selectedCondition === 'Good' || selectedCondition === 'Excellent') {
      setTreatment(prev => ({
        ...prev,
        scanningType: '',
        scanningRequired: false,
        scanningCost: 0,
        needsOperation: 'no',
        opAmount: 0,
        extraCharges: 0,
        nextVisitDate: ''
      }));
    }
    
    // If next visit is 'no', remove scanning
    const scanningType = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? '' : treatment.scanningType;
    const scanningCost = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? 0 : treatment.scanningCost;
    const scanningRequired = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? false : treatment.scanningRequired;
    const needsOperation = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? false : treatment.needsOperation === 'yes';
    const opAmount = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? 0 : (treatment.needsOperation === 'yes' ? parseInt(treatment.opAmount || 0) : 0);
    const extraCharges = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') 
      ? 0 : parseInt(treatment.extraCharges || 0);
    const nextVisitDate = treatment.nextVisitRequired === 'yes' ? getFormattedDate(treatment.nextVisitDate) : 'Not Required';
    
    const totalCharges = (selectedCondition === 'Good' || selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') ? 0 : (
      extraCharges + 
      opAmount + 
      parseInt(scanningCost || 0)
    );
    
    // SET STATUS BASED ON TREATMENT STATUS
    let newStatus = '';
    let finalTreatmentStatus = treatment.treatmentStatus;
    
    // If condition is Good or Excellent, treatment is automatically completed
    if (selectedCondition === 'Good' || selectedCondition === 'Excellent') {
      newStatus = 'Treatment Completed';
      finalTreatmentStatus = 'Treatment Completed';
    } 
    // If doctor manually selects Treatment Completed
    else if (treatment.treatmentStatus === 'Treatment Completed') {
      newStatus = 'Treatment Completed';
    }
    // If operation is needed
    else if (needsOperation && !(selectedCondition === 'Good' || selectedCondition === 'Excellent')) {
      newStatus = 'Awaiting Op Payment';
    } 
    // If scanning is needed
    else if (scanningRequired && scanningType && !(selectedCondition === 'Good' || selectedCondition === 'Excellent')) {
      newStatus = 'Awaiting Scan Payment';
    } 
    // Default case
    else {
      newStatus = 'Payment Pending';
    }
    
    const updatedHistoryEntry = {
      date: getTodayDate(),
      diagnosis: treatment.diagnosis,
      healthAdvice: treatment.healthAdvice,
      medicines: treatment.medicines,
      labTests: treatment.labTests,
      condition: selectedCondition,
      treatmentStatus: finalTreatmentStatus,
      nextVisit: nextVisitDate,
      type: needsOperation ? `Operation (${treatment.opStatus})` : 
            scanningRequired ? `Scanning (${scanningType})` : 
            "General Checkup",
      charges: totalCharges,
      scanningType: scanningType,
      scanningCost: scanningCost,
      opAmount: opAmount,
      opStatus: treatment.opStatus,
      extraCharges: extraCharges
    };

    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        const updatedHistory = [...p.history];
        if (editHistoryIndex !== null) {
          updatedHistory[editHistoryIndex] = updatedHistoryEntry;
        } else {
          updatedHistory.unshift(updatedHistoryEntry);
        }
        
        const updatedPatient = {
          ...p,
          condition: selectedCondition,
          treatmentStatus: finalTreatmentStatus,
          extraCharges: extraCharges,
          opAmount: opAmount,
          scanningRequired: scanningRequired,
          scanningType: scanningType,
          scanningCost: scanningCost,
          nextVisit: nextVisitDate,
          status: newStatus,
          seenByDoctor: true,
          lastVisitDate: getTodayDate(),
          history: updatedHistory
        };
        
        showNotification('Treatment record updated successfully', 'success');
        return updatedPatient;
      }
      return p;
    }));

    setTreatment({ 
      diagnosis: '',
      healthAdvice: '',
      medicines: '',
      labTests: '',
      condition: 'Stable',
      selectedCondition: 'Stable',
      needsOperation: 'no',
      opAmount: 0,
      opStatus: 'Successful',
      nextVisitDate: '',
      nextVisitRequired: 'yes',
      scanningRequired: false,
      scanningType: '',
      scanningCost: 0,
      extraCharges: 0,
      treatmentStatus: 'Treatment Not Completed'
    });
    
    setSelectedPatient(null);
    setEditHistoryIndex(null);
    setView('list');
  };

  // Get unique patients for global history (grouped by patient)
  const getGroupedPatients = () => {
    const grouped = {};
    
    patients.forEach(patient => {
      if (!grouped[patient.name]) {
        grouped[patient.name] = {
          name: patient.name,
          totalTransactions: 0,
          totalAmountPaid: 0,
          pendingAmount: 0,
          lastPaymentDate: '',
          village: patient.village,
          phone: patient.phone,
          nextVisit: patient.nextVisit
        };
      }
      
      // Get transactions for this patient
      const patientTransactions = transactions.filter(t => t.patientName === patient.name);
      const totalPaid = patientTransactions.reduce((sum, t) => sum + t.amount, 0);
      const lastTransaction = patientTransactions[0];
      const pendingAmount = getPendingAmount(patient);
      
      // Update grouped data
      grouped[patient.name].totalTransactions += patientTransactions.length;
      grouped[patient.name].totalAmountPaid += totalPaid;
      grouped[patient.name].pendingAmount += pendingAmount;
      
      if (lastTransaction && (!grouped[patient.name].lastPaymentDate || lastTransaction.date > grouped[patient.name].lastPaymentDate)) {
        grouped[patient.name].lastPaymentDate = lastTransaction.date;
      }
    });
    
    return Object.values(grouped);
  };

  // Get transactions for a specific patient
  const getPatientTransactions = (patientName) => {
    return transactions.filter(t => t.patientName === patientName);
  };

  // Calculate pending amount for a patient
  const getPendingAmount = (patient) => {
    const totalCharges = 200 + (patient.opAmount || 0) + (patient.extraCharges || 0) + (patient.scanningCost || 0);
    const totalPaid = patient.totalPaid || 0;
    return Math.max(0, totalCharges - totalPaid);
  };

  // Calculate specific pending amounts
  const getOpPending = (patient) => {
    const opAmount = patient.opAmount || 0;
    const opAmountPaid = patient.opAmountPaid || 0;
    return Math.max(0, opAmount - opAmountPaid);
  };

  const getScanPending = (patient) => {
    const scanCost = patient.scanningCost || 0;
    const scanPaid = patient.scanPaid || 0;
    return Math.max(0, scanCost - scanPaid);
  };

  const getServicePending = (patient) => {
    const extraCharges = patient.extraCharges || 0;
    const extraPaid = patient.extraPaid || 0;
    return Math.max(0, extraCharges - extraPaid);
  };

  // Check if patient can be updated (not frozen)
  const canUpdatePatient = (patient) => {
    // Allow updates if condition is not Good or Excellent
    // OR if there are pending payments
    if (patient.condition === 'Good' || patient.condition === 'Excellent') {
      const pending = getPendingAmount(patient);
      return pending > 0; // Allow update if there are pending payments
    }
    return true; // Always allow update for other conditions
  };

  // Calculate total charges for a patient
  const getTotalCharges = (patient) => {
    return 200 + (patient.opAmount || 0) + (patient.extraCharges || 0) + (patient.scanningCost || 0);
  };

  // Get patients with next visit today
  const getTodayVisitPatients = () => {
    return patients.filter(p => 
      p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit)
    );
  };

  // Get patients with upcoming visits (future dates)
  const getUpcomingVisitPatients = () => {
    return patients.filter(p => {
      if (!p.nextVisit || p.nextVisit === 'Not Required' || p.nextVisit === 'Not Assigned') return false;
      const nextVisitDate = new Date(p.nextVisit.split('-').reverse().join('-'));
      const today = new Date();
      return nextVisitDate > today;
    });
  };

  return (
    <div className="hms-container">
      {/* Notification Bar - Top Right Corner */}
      {notification && (
        <div className={`notification-bar ${notification.type}`}>
          <div className="notification-content">
            <FaBell /> {notification.message}
            <button className="notification-close" onClick={() => setNotification(null)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Sound Control */}
      <div className="sound-control no-print">
        <button 
          className={`sound-btn ${soundEnabled ? 'active' : ''}`}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Disable sound" : "Enable sound"}
        >
          {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className="sidebar no-print">
        <div className="logo"><FaHospital /> MediCare <span>Pro</span></div>
        <nav>
          <button className={role === 'accounts' ? 'active' : ''} onClick={() => handleRoleChange('accounts')}>
            <FaMoneyCheckAlt /> Accounts
            {patientCompletedAlert && role !== 'accounts' && (
              <span className="sidebar-alert"></span>
            )}
          </button>
          <button className={role === 'doctor' ? 'active' : ''} onClick={() => handleRoleChange('doctor')}>
            <FaUserMd /> Doctor Panel
            {newPatientAlert && role !== 'doctor' && (
              <span className="sidebar-alert"></span>
            )}
          </button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => handleRoleChange('admin')}>
            <FaChartBar /> Admin
          </button>
        </nav>
        <button className="logout-btn" onClick={() => handleLogout('sidebar')}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header no-print">
          <h1>{role.toUpperCase()} DASHBOARD</h1>
          <div className="header-right">
            <span className="date-tag">{getTodayDate()}</span>
            {role === 'admin' && isAdminLoggedIn && (
              <button className="logout-btn-header" onClick={() => handleLogout('admin')}>
                <FaSignOutAlt /> Logout Admin
              </button>
            )}
          </div>
        </header>

        {/* --- ACCOUNTS VIEW --- */}
        {role === 'accounts' && (
          <section>
            {/* Accounts Stats */}
            <div className="stats-row no-print">
              <div className="stat-card red">
                <h3>Total Pending Amount</h3>
                <p>{formatCurrency(adminStats.totalPendingAmount)}</p>
              </div>
              <div className="stat-card green">
                <h3>Today's Revenue</h3>
                <p>{formatCurrency(adminStats.todayRevenue)}</p>
              </div>
              <div className="stat-card blue">
                <h3>Today's Visits</h3>
                <p>{adminStats.todayVisits} patients</p>
              </div>
              <div className="stat-card orange">
                <h3>Pending Checkups</h3>
                <p>{adminStats.pendingCheckups}</p>
              </div>
            </div>

            <div className="action-bar no-print">
              <button className="btn-primary" onClick={() => setView(view === 'register' ? 'list' : 'register')}>
                {view === 'register' ? 'Back' : '+ Register New Patient'}
              </button>
              <button className="btn-outline" onClick={() => setView(view === 'history' ? 'list' : 'history')}>
                <FaHistory /> {view === 'history' ? 'Back' : 'Global Payment History'}
              </button>
              {getTodayVisitPatients().length > 0 && (
                <button className="btn-today-visits" onClick={() => setView('todayVisits')}>
                  <FaCalendarDay /> Today's Visits ({getTodayVisitPatients().length})
                </button>
              )}
            </div>

            {view === 'todayVisits' ? (
              <div className="table-container">
                <h3><FaCalendarDay /> Today's Scheduled Visits</h3>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Status</th>
                      <th>Next Visit</th>
                      <th>Total Paid</th>
                      <th>Pending</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTodayVisitPatients().map(p => {
                      const totalPending = getPendingAmount(p);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="patient-cell">
                              <strong>{p.name}</strong>
                              <small>{p.village} • {p.phone}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`condition-badge condition-${p.condition?.toLowerCase()}`}>
                              {p.condition || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-tag ${p.status.toLowerCase().replace(/ /g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <span className="next-visit-today">
                              <FaCalendarCheck /> Today
                            </span>
                          </td>
                          <td>
                            <strong>{formatCurrency(p.totalPaid || 0)}</strong>
                          </td>
                          <td>
                            <span className={`pending-badge ${totalPending > 0 ? 'pending' : 'paid'}`}>
                              {formatCurrency(totalPending)}
                            </span>
                          </td>
                          <td>
                            <div className="action-stack">
                              <button className="btn-history" onClick={() => setHistoryTarget(p)}>
                                <FaHistory /> History
                              </button>
                              <button className="btn-view" onClick={() => {
                                setSelectedPatient(p);
                                setView('treat');
                              }}>
                                <FaEye /> View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : view === 'register' ? (
              <div className="form-card no-print">
                <h2>New Registration</h2>
                <form onSubmit={(e) => { e.preventDefault(); openPaymentModal(formData, true); }}>
                  <input placeholder="Patient Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="grid-2">
                    <input type="number" placeholder="Age" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    <input placeholder="Village" required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
                  </div>
                  <input placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <textarea placeholder="Reason for Visit" required value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} />
                  <button className="btn-save">Register & Collect Fee (₹200)</button>
                </form>
              </div>
            ) : view === 'history' ? (
              <div className="table-container">
                <h3>Global Payment History</h3>
                <p className="history-subtitle">Click on View to see individual patient's payment history</p>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Next Visit</th>
                      <th>Total Transactions</th>
                      <th>Total Amount Paid</th>
                      <th>Pending Amount</th>
                      <th>Last Payment Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getGroupedPatients().map((patientGroup, index) => (
                      <tr key={index}>
                        <td>
                          <div className="patient-info-cell">
                            <strong>{patientGroup.name}</strong>
                            <small>{patientGroup.village} • {patientGroup.phone}</small>
                          </div>
                        </td>
                        <td>
                          {patientGroup.nextVisit && patientGroup.nextVisit !== 'Not Required' && patientGroup.nextVisit !== 'Not Assigned' ? (
                            <span className={`next-visit-badge ${isToday(patientGroup.nextVisit) ? 'today' : 'future'}`}>
                              <FaCalendarAlt /> {patientGroup.nextVisit}
                              {isToday(patientGroup.nextVisit) && <span className="today-indicator">Today</span>}
                            </span>
                          ) : (
                            <span className="no-visit">No Visit</span>
                          )}
                        </td>
                        <td>
                          <span className="badge-count">{patientGroup.totalTransactions} txns</span>
                        </td>
                        <td>
                          <strong className="amount-cell">{formatCurrency(patientGroup.totalAmountPaid)}</strong>
                        </td>
                        <td>
                          <strong className={`pending-amount ${patientGroup.pendingAmount > 0 ? 'warning' : 'success'}`}>
                            {formatCurrency(patientGroup.pendingAmount)}
                          </strong>
                        </td>
                        <td>{patientGroup.lastPaymentDate || 'N/A'}</td>
                        <td>
                          <button 
                            className="btn-view-history" 
                            onClick={() => setPatientHistoryModal(patientGroup.name)}
                          >
                            <FaEye /> View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-container">
                <div className="table-header-row">
                  <h3>Billing & Records</h3>
                  <div className="table-actions">
                    <span className="pending-count">
                      Pending Patients: {patients.filter(p => getPendingAmount(p) > 0).length}
                    </span>
                    {getTodayVisitPatients().length > 0 && (
                      <span className="today-visits-count">
                        <FaCalendarDay /> Today's Visits: {getTodayVisitPatients().length}
                      </span>
                    )}
                  </div>
                </div>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Status</th>
                      <th>Next Visit</th>
                      <th>Total Paid</th>
                      <th>Pending</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(p => {
                      const totalPending = getPendingAmount(p);
                      const opPending = getOpPending(p);
                      const scanPending = getScanPending(p);
                      const servicePending = getServicePending(p);
                      const canUpdate = canUpdatePatient(p);
                      const totalCharges = getTotalCharges(p);
                      const isVisitToday = p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit);
                      
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="patient-cell">
                              <strong>{p.name}</strong>
                              <small>{p.village} • {p.phone}</small>
                              {p.scanningRequired && (
                                <span className="scan-badge"><FaXRay /> {p.scanningType}</span>
                              )}
                              {isVisitToday && (
                                <span className="today-visit-indicator"><FaCalendarDay /> Today's Visit</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`condition-badge condition-${p.condition?.toLowerCase()}`}>
                              {p.condition || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-tag ${p.status.toLowerCase().replace(/ /g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            {p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' ? (
                              <div className="next-visit-cell">
                                <span className={`next-visit-date ${isVisitToday ? 'today' : ''}`}>
                                  <FaCalendarAlt /> {p.nextVisit}
                                </span>
                                {isVisitToday && <span className="visit-today-badge">Today</span>}
                              </div>
                            ) : (
                              <span className="no-visit-scheduled">Not Scheduled</span>
                            )}
                          </td>
                          <td>
                            <div>
                              <strong>{formatCurrency(p.totalPaid || 0)}</strong>
                              <div className="total-charges-small">/ {formatCurrency(totalCharges)}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`pending-badge ${totalPending > 0 ? 'pending' : 'paid'}`}>
                              {formatCurrency(totalPending)}
                            </span>
                          </td>
                          <td>
                            <div className="action-stack">
                              {opPending > 0 && (
                                <button className="btn-pay op" onClick={() => openPaymentModal(p, false, true, false, false)}>
                                  <FaProcedures /> Op Fee ({formatCurrency(opPending)})
                                </button>
                              )}
                              {scanPending > 0 && (
                                <button className="btn-pay scan" onClick={() => openPaymentModal(p, false, false, true, false)}>
                                  <FaXRay /> Scan Fee ({formatCurrency(scanPending)})
                                </button>
                              )}
                              {servicePending > 0 && p.condition !== 'Good' && p.condition !== 'Excellent' && (
                                <button className="btn-pay service" onClick={() => openPaymentModal(p, false, false, false, true)}>
                                  <FaMoneyBill /> Service ({formatCurrency(servicePending)})
                                </button>
                              )}
                              <button className="btn-history" onClick={() => setHistoryTarget(p)}>
                                <FaHistory /> History
                              </button>
                              <button className="btn-print-report" onClick={() => setShowMedicalReportModal(p)}>
                                <FaFilePdf /> Report
                              </button>
                              {role === 'admin' && isAdminLoggedIn && (
                                <button 
                                  className="btn-delete-patient" 
                                  onClick={() => handleDeletePatient(p.id)}
                                  title="Delete Patient"
                                >
                                  <FaTrash /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* --- DOCTOR VIEW --- */}
        {role === 'doctor' && (
          <section>
            {/* Doctor Statistics */}
            <div className="stats-row no-print">
              <div className="stat-card blue">
                <h3>Total Patients Seen</h3>
                <p>{doctorStats.totalPatientsSeen}</p>
              </div>
              <div className="stat-card orange">
                <h3>Operations Performed</h3>
                <p>{doctorStats.operationsPerformed}</p>
              </div>
              <div className="stat-card purple">
                <h3>Scans Prescribed</h3>
                <p>{doctorStats.scansPrescribed}</p>
              </div>
              <div className="stat-card green">
                <h3>Today's Patients</h3>
                <p>{doctorStats.todayPatients}</p>
              </div>
              
              <div className="stat-card teal">
                <h3>Today's Visits</h3>
                <p>{doctorStats.todayVisits}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-bar no-print">
              {newPatientAlert && (
                <button className="btn-new-patients">
                  <FaUserPlus /> New Patients ({patients.filter(p => p.status === 'Awaiting Doctor' && !p.seenByDoctor).length})
                </button>
              )}
              {doctorStats.todayVisits > 0 && (
                <button className="btn-today-visits" onClick={() => setView('todayVisits')}>
                  <FaCalendarDay /> Today's Visits ({doctorStats.todayVisits})
                </button>
              )}
              {doctorStats.upcomingVisits > 0 && (
                <button className="btn-upcoming-visits" onClick={() => setView('upcomingVisits')}>
                  <FaCalendar /> Upcoming Visits ({doctorStats.upcomingVisits})
                </button>
              )}
            </div>

            {view === 'todayVisits' ? (
              <div className="table-container">
                <h3><FaCalendarDay /> Today's Scheduled Visits</h3>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Problem</th>
                      <th>Condition</th>
                      <th>Treatment Status</th>
                      <th>Status</th>
                      <th>Last Visit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTodayVisitPatients().map(p => {
                      const canUpdate = canUpdatePatient(p);
                      const hasHistory = p.history && p.history.length > 0;
                      
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="patient-cell">
                              <strong>{p.name}</strong> ({p.age})
                              <small>{p.village}</small>
                              <span className="today-visit-indicator"><FaCalendarDay /> Scheduled Today</span>
                            </div>
                          </td>
                          <td className="problem-cell">{p.problem}</td>
                          <td>
                            <span className={`condition-badge condition-${p.condition?.toLowerCase() || 'pending'}`}>
                              {p.condition || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`treatment-status-badge ${p.treatmentStatus === 'Treatment Completed' ? 'completed' : 'not-completed'}`}>
                              {p.treatmentStatus || 'Treatment Not Completed'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-tag ${p.status.toLowerCase().replace(/ /g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>{p.history?.[0]?.date || 'First Visit'}</td>
                          <td>
                            <div className="doctor-actions">
                              <button 
                                className={`btn-treat ${!canUpdate ? 'disabled' : ''}`}
                                onClick={() => {
                                  if (canUpdate) {
                                    setSelectedPatient(p);
                                    setView('treat');
                                    setEditHistoryIndex(null);
                                    setTreatment({
                                      diagnosis: '',
                                      healthAdvice: '',
                                      medicines: '',
                                      labTests: '',
                                      condition: 'Stable',
                                      selectedCondition: p.condition || 'Stable',
                                      needsOperation: 'no',
                                      opAmount: 0,
                                      opStatus: 'Successful',
                                      nextVisitDate: '',
                                      nextVisitRequired: 'yes',
                                      scanningRequired: false,
                                      scanningType: '',
                                      scanningCost: 0,
                                      extraCharges: 0,
                                      treatmentStatus: p.treatmentStatus || 'Treatment Not Completed'
                                    });
                                  }
                                }}
                                disabled={!canUpdate}
                                title={!canUpdate ? "Patient completed treatment. Cannot update unless there are pending payments." : ""}
                              >
                                <FaNotesMedical /> {hasHistory ? 'Update' : 'Treat'}
                                {!canUpdate && <FaLock style={{marginLeft: '5px', fontSize: '10px'}} />}
                              </button>
                              <button className="btn-history" onClick={() => setHistoryTarget(p)}>
                                <FaHistory /> History
                              </button>
                              {role === 'admin' && isAdminLoggedIn && (
                                <button 
                                  className="btn-delete-patient" 
                                  onClick={() => handleDeletePatient(p.id)}
                                  title="Delete Patient"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : view === 'upcomingVisits' ? (
              <div className="table-container">
                <h3><FaCalendar /> Upcoming Visits</h3>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Treatment Status</th>
                      <th>Next Visit</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUpcomingVisitPatients().map(p => {
                      const canUpdate = canUpdatePatient(p);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="patient-cell">
                              <strong>{p.name}</strong> ({p.age})
                              <small>{p.village} • {p.phone}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`condition-badge condition-${p.condition?.toLowerCase() || 'pending'}`}>
                              {p.condition || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`treatment-status-badge ${p.treatmentStatus === 'Treatment Completed' ? 'completed' : 'not-completed'}`}>
                              {p.treatmentStatus || 'Treatment Not Completed'}
                            </span>
                          </td>
                          <td>
                            <span className="next-visit-date future">
                              <FaCalendarAlt /> {p.nextVisit}
                            </span>
                          </td>
                          <td>
                            <span className={`status-tag ${p.status.toLowerCase().replace(/ /g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <div className="doctor-actions">
                              <button className="btn-history" onClick={() => setHistoryTarget(p)}>
                                <FaHistory /> History
                              </button>
                              <button 
                                className="btn-edit" 
                                onClick={() => {
                                  setSelectedPatient(p);
                                  setView('treat');
                                }}
                              >
                                <FaEdit /> Update
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : view === 'treat' ? (
              <div className="form-card">
                <div className="treatment-header">
                  <h2><FaStethoscope /> {editHistoryIndex !== null ? 'Edit Treatment' : 'Treatment'}: {selectedPatient?.name}</h2>
                  <div className="patient-info">
                    <span>Age: {selectedPatient?.age}</span>
                    <span>Village: {selectedPatient?.village}</span>
                    <span>Phone: {selectedPatient?.phone}</span>
                    {selectedPatient?.nextVisit && selectedPatient?.nextVisit !== 'Not Required' && selectedPatient?.nextVisit !== 'Not Assigned' && (
                      <span className={`next-visit-header ${isToday(selectedPatient.nextVisit) ? 'today' : ''}`}>
                        <FaCalendarAlt /> Next Visit: {selectedPatient.nextVisit}
                        {isToday(selectedPatient.nextVisit) && <span className="today-indicator">Today</span>}
                      </span>
                    )}
                  </div>
                </div>
                
                <form onSubmit={editHistoryIndex !== null ? handleUpdateTreatment : handleTreatmentSubmit}>
                  {/* Diagnosis Section */}
                  <div className="form-section">
                    <label><FaNotesMedical /> Diagnosis *</label>
                    <textarea 
                      placeholder="Enter detailed diagnosis..." 
                      required 
                      value={treatment.diagnosis} 
                      onChange={e => setTreatment({...treatment, diagnosis: e.target.value})} 
                      rows="3"
                    />
                  </div>

                  {/* Health Advice Section */}
                  <div className="form-section">
                    <label><FaHeartbeat /> Health & Lifestyle Advice</label>
                    <textarea 
                      placeholder="Health tips, lifestyle changes, exercise, diet recommendations..." 
                      value={treatment.healthAdvice} 
                      onChange={e => setTreatment({...treatment, healthAdvice: e.target.value})} 
                      rows="3"
                    />
                  </div>

                  {/* Medicines Section */}
                  <div className="form-section">
                    <label><FaSyringe /> Medicines Prescribed</label>
                    <textarea 
                      placeholder="List of medicines prescribed (comma separated)" 
                      value={treatment.medicines} 
                      onChange={e => setTreatment({...treatment, medicines: e.target.value})} 
                      rows="2"
                    />
                  </div>

                  {/* Lab Tests Section */}
                  <div className="form-section">
                    <label><FaClipboardCheck /> Lab Tests Recommended</label>
                    <textarea 
                      placeholder="Recommended lab tests..." 
                      value={treatment.labTests} 
                      onChange={e => setTreatment({...treatment, labTests: e.target.value})} 
                      rows="2"
                    />
                  </div>

                  {/* Treatment Status */}
                  <div className="form-section">
                    <label>Treatment Status *</label>
                    <select 
                      value={treatment.treatmentStatus} 
                      onChange={e => setTreatment({...treatment, treatmentStatus: e.target.value})}
                      className="treatment-status-select"
                      required
                    >
                      {treatmentStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Patient Condition */}
                  <div className="form-section">
                    <label>Patient Condition *</label>
                    <select 
                      value={treatment.selectedCondition} 
                      onChange={e => {
                        const newCondition = e.target.value;
                        setTreatment({...treatment, selectedCondition: newCondition});
                        // If condition is Good/Excellent, automatically set treatment status to completed
                        if (newCondition === 'Good' || newCondition === 'Excellent') {
                          setTreatment(prev => ({
                            ...prev,
                            treatmentStatus: 'Treatment Completed'
                          }));
                        }
                      }}
                      className="condition-select"
                    >
                      {conditionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <small className="form-hint">
                      {treatment.selectedCondition === 'Good' || treatment.selectedCondition === 'Excellent' 
                        ? 'Patient will be marked as completed with NO additional charges' 
                        : 'Additional services can be added below'}
                    </small>
                  </div>

                  {/* Next Visit Required */}
                  <div className="form-section">
                    <label>Next Visit Required?</label>
                    <div className="radio-group">
                      <div className="radio-option">
                        <input 
                          type="radio"
                          id="next-visit-yes"
                          name="nextVisitRequired"
                          value="yes"
                          checked={treatment.nextVisitRequired === 'yes'}
                          onChange={(e) => {
                            setTreatment({...treatment, nextVisitRequired: e.target.value});
                          }}
                        />
                        <label htmlFor="next-visit-yes">Yes</label>
                      </div>
                      <div className="radio-option">
                        <input 
                          type="radio"
                          id="next-visit-no"
                          name="nextVisitRequired"
                          value="no"
                          checked={treatment.nextVisitRequired === 'no'}
                          onChange={(e) => {
                            setTreatment({...treatment, nextVisitRequired: e.target.value});
                          }}
                        />
                        <label htmlFor="next-visit-no">No</label>
                      </div>
                    </div>
                  </div>

                  {/* Next Visit Date - Only show if required */}
                  {treatment.nextVisitRequired === 'yes' && (
                    <div className="form-section">
                      <label>Next Visit Date *</label>
                      <input 
                        type="date" 
                        required 
                        value={treatment.nextVisitDate} 
                        onChange={e => setTreatment({...treatment, nextVisitDate: e.target.value})}
                        min={getTodayInputDate()}
                      />
                    </div>
                  )}

                  {/* Scanning Section - Hidden for Good/Excellent and when next visit is 'no' */}
                  {(treatment.selectedCondition !== 'Good' && treatment.selectedCondition !== 'Excellent' && treatment.nextVisitRequired === 'yes') && (
                    <div className="form-section">
                      <label>Scanning Required</label>
                      <div className="scanning-section">
                        <select 
                          value={treatment.scanningType} 
                          onChange={e => {
                            const scanningType = e.target.value;
                            setTreatment({
                              ...treatment, 
                              scanningType,
                              scanningRequired: scanningType !== ''
                            });
                          }}
                          className="scan-select"
                        >
                          {scanningOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        {treatment.scanningType && (
                          <div className="scan-cost-display">
                            <span className="cost-label">Cost:</span>
                            <span className="cost-amount">{formatCurrency(treatment.scanningCost)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Operation Section - Radio Buttons - Hidden for Good/Excellent and when next visit is 'no' */}
                  {(treatment.selectedCondition !== 'Good' && treatment.selectedCondition !== 'Excellent' && treatment.nextVisitRequired === 'yes') && (
                    <div className="form-section">
                      <label>Needs Surgery?</label>
                      <div className="radio-group">
                        <div className="radio-option">
                          <input 
                            type="radio"
                            id="surgery-no"
                            name="needsOperation"
                            value="no"
                            checked={treatment.needsOperation === 'no'}
                            onChange={(e) => {
                              setTreatment({
                                ...treatment, 
                                needsOperation: e.target.value,
                                opAmount: e.target.value === 'no' ? 0 : treatment.opAmount
                              });
                            }}
                          />
                          <label htmlFor="surgery-no">No Surgery Required</label>
                        </div>
                        <div className="radio-option">
                          <input 
                            type="radio"
                            id="surgery-yes"
                            name="needsOperation"
                            value="yes"
                            checked={treatment.needsOperation === 'yes'}
                            onChange={(e) => setTreatment({...treatment, needsOperation: e.target.value})}
                          />
                          <label htmlFor="surgery-yes">Yes, Surgery Required</label>
                        </div>
                      </div>
                      
                      {treatment.needsOperation === 'yes' && (
                        <div className="operation-details">
                          <div className="op-amount-section">
                            <label>Surgery Amount (₹)</label>
                            <input 
                              type="number" 
                              placeholder="Enter surgery amount" 
                              required 
                              value={treatment.opAmount}
                              onChange={e => setTreatment({...treatment, opAmount: e.target.value})}
                            />
                          </div>
                          <div className="op-status-section">
                            <label>Surgery Status</label>
                            <select 
                              value={treatment.opStatus} 
                              onChange={e => setTreatment({...treatment, opStatus: e.target.value})}
                              className="status-select"
                            >
                              {opStatusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Service Charges - Show ALWAYS but with conditional logic */}
                  <div className="form-section">
                    <label>Service/Lab Charges (₹)</label>
                    <input 
                      type="number" 
                      placeholder="Additional charges for lab tests, medicines, etc." 
                      value={treatment.extraCharges}
                      onChange={e => setTreatment({...treatment, extraCharges: e.target.value})}
                      disabled={treatment.selectedCondition === 'Good' || treatment.selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no'}
                    />
                    {(treatment.selectedCondition === 'Good' || treatment.selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') && (
                      <small className="form-hint">Service charges disabled for Good/Excellent conditions or when next visit is not required</small>
                    )}
                  </div>

                  {/* Charges Summary - Show only if there are charges */}
                  {(treatment.scanningCost > 0 || treatment.opAmount > 0 || treatment.extraCharges > 0) && (
                    <div className="charges-summary">
                      <h4>Total Charges Summary</h4>
                      <div className="charges-list">
                        {treatment.scanningCost > 0 && (
                          <div className="charge-item">
                            <span>Scanning ({treatment.scanningType}):</span>
                            <span>{formatCurrency(treatment.scanningCost)}</span>
                          </div>
                        )}
                        {treatment.opAmount > 0 && (
                          <div className="charge-item">
                            <span>Surgery Charges:</span>
                            <span>{formatCurrency(treatment.opAmount)}</span>
                          </div>
                        )}
                        {treatment.extraCharges > 0 && (
                          <div className="charge-item">
                            <span>Service Charges:</span>
                            <span>{formatCurrency(treatment.extraCharges)}</span>
                          </div>
                        )}
                        <div className="charge-total">
                          <span>Total Charges:</span>
                          <span>{formatCurrency(treatment.scanningCost + parseInt(treatment.opAmount || 0) + parseInt(treatment.extraCharges || 0))}</span>
                        </div>
                      </div>
                      <small className="form-hint">
                        After saving, this patient will be sent to Accounts for payment processing.
                      </small>
                    </div>
                  )}

                  {/* No Charges Message for Good/Excellent or when next visit is 'no' */}
                  {(treatment.selectedCondition === 'Good' || treatment.selectedCondition === 'Excellent' || treatment.nextVisitRequired === 'no') && (
                    <div className="no-charges-message">
                      <FaCheckCircle /> No additional charges for {treatment.selectedCondition === 'Good' || treatment.selectedCondition === 'Excellent' ? treatment.selectedCondition : 'patients not requiring next visit'}. Patient will be marked as completed.
                    </div>
                  )}

                  <div className="btn-group">
                    <button className="btn-save" type="submit">
                      <FaClipboardCheck /> {editHistoryIndex !== null ? 'Update Treatment Record' : 'Save Treatment Record'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => {
                      setView('list');
                      setEditHistoryIndex(null);
                      setTreatment({ 
                        diagnosis: '',
                        healthAdvice: '',
                        medicines: '',
                        labTests: '',
                        condition: 'Stable',
                        selectedCondition: 'Stable',
                        needsOperation: 'no',
                        opAmount: 0,
                        opStatus: 'Successful',
                        nextVisitDate: '',
                        nextVisitRequired: 'yes',
                        scanningRequired: false,
                        scanningType: '',
                        scanningCost: 0,
                        extraCharges: 0,
                        treatmentStatus: 'Treatment Not Completed'
                      });
                    }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="table-container">
                <div className="table-header-row">
                  <h3>Patient Queue</h3>
                  <div className="header-right">
                    {newPatientAlert && (
                      <div className="alert-badge">
                        <FaBell /> New Patients Awaiting
                      </div>
                    )}
                    {doctorStats.todayVisits > 0 && (
                      <div className="today-visits-badge">
                        <FaCalendarDay /> {doctorStats.todayVisits} Visits Today
                      </div>
                    )}
                  </div>
                </div>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Problem</th>
                      <th>Condition</th>
                      <th>Treatment Status</th>
                      <th>Next Visit</th>
                      <th>Status</th>
                      <th>Last Visit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(p => {
                      const canUpdate = canUpdatePatient(p);
                      const hasHistory = p.history && p.history.length > 0;
                      const isVisitToday = p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit);
                      
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="patient-cell">
                              <strong>{p.name}</strong> ({p.age})
                              <small>{p.village}</small>
                              {isVisitToday && (
                                <span className="today-visit-indicator-cell"><FaCalendarDay /> Today</span>
                              )}
                            </div>
                          </td>
                          <td className="problem-cell">{p.problem}</td>
                          <td>
                            <span className={`condition-badge condition-${p.condition?.toLowerCase() || 'pending'}`}>
                              {p.condition || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`treatment-status-badge ${p.treatmentStatus === 'Treatment Completed' ? 'completed' : 'not-completed'}`}>
                              {p.treatmentStatus || 'Treatment Not Completed'}
                            </span>
                          </td>
                          <td>
                            {p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' ? (
                              <div className="next-visit-cell">
                                <span className={`next-visit-date ${isVisitToday ? 'today' : 'future'}`}>
                                  <FaCalendarAlt /> {p.nextVisit}
                                </span>
                              </div>
                            ) : (
                              <span className="no-visit">Not Scheduled</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-tag ${p.status.toLowerCase().replace(/ /g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>{p.history?.[0]?.date || 'First Visit'}</td>
                          <td>
                            <div className="doctor-actions">
                              <button 
                                className={`btn-treat ${!canUpdate ? 'disabled' : ''}`}
                                onClick={() => {
                                  if (canUpdate) {
                                    setSelectedPatient(p);
                                    setView('treat');
                                    setEditHistoryIndex(null);
                                    setTreatment({
                                      diagnosis: '',
                                      healthAdvice: '',
                                      medicines: '',
                                      labTests: '',
                                      condition: 'Stable',
                                      selectedCondition: p.condition || 'Stable',
                                      needsOperation: 'no',
                                      opAmount: 0,
                                      opStatus: 'Successful',
                                      nextVisitDate: '',
                                      nextVisitRequired: 'yes',
                                      scanningRequired: false,
                                      scanningType: '',
                                      scanningCost: 0,
                                      extraCharges: 0,
                                      treatmentStatus: p.treatmentStatus || 'Treatment Not Completed'
                                    });
                                  }
                                }}
                                disabled={!canUpdate}
                                title={!canUpdate ? "Patient completed treatment. Cannot update unless there are pending payments." : ""}
                              >
                                <FaNotesMedical /> {hasHistory ? 'Update' : 'Treat'}
                                {!canUpdate && <FaLock style={{marginLeft: '5px', fontSize: '10px'}} />}
                              </button>
                              <button className="btn-history" onClick={() => setHistoryTarget(p)}>
                                <FaHistory /> History
                              </button>
                              {role === 'admin' && isAdminLoggedIn && (
                                <button 
                                  className="btn-delete-patient" 
                                  onClick={() => handleDeletePatient(p.id)}
                                  title="Delete Patient"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* --- ADMIN VIEW --- */}
        {role === 'admin' && isAdminLoggedIn && (
          <section>
            <div className="stats-row no-print">
              <div className="stat-card red">
                <h3>Total Pending Amount</h3>
                <p>{formatCurrency(adminStats.totalPendingAmount)}</p>
              </div>
              <div className="stat-card green">
                <h3>Completed Checkups</h3>
                <p>{adminStats.completedCheckups}</p>
              </div>
              <div className="stat-card orange">
                <h3>Pending Checkups</h3>
                <p>{adminStats.pendingCheckups}</p>
              </div>
              <div className="stat-card blue">
                <h3>Today's Revenue</h3>
                <p>{formatCurrency(adminStats.todayRevenue)}</p>
              </div>
              <div className="stat-card purple">
                <h3>Today's Visits</h3>
                <p>{adminStats.todayVisits} patients</p>
              </div>
            </div>
            
            <div className="admin-controls no-print">
              <button className="btn-primary" onClick={() => setView(view === 'reports' ? 'list' : 'reports')}>
                <FaFileMedicalAlt /> {view === 'reports' ? 'Back to Logs' : 'View Reports'}
              </button>
              
            </div>

            {view === 'reports' ? (
              <div className="reports-section">
                <h3>Patient Completion Status</h3>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Condition</th>
                      <th>Treatment Status</th>
                      <th>Next Visit</th>
                      <th>Status</th>
                      <th>Total Charges</th>
                      <th>Paid Amount</th>
                      <th>Pending Amount</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(p => {
                      const pending = getPendingAmount(p);
                      const totalCharges = getTotalCharges(p);
                      const isCompleted = p.status === 'Treatment Completed' || p.treatmentStatus === 'Treatment Completed';
                      const isVisitToday = p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' && isToday(p.nextVisit);
                      
                      return (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>
                            <span className={`condition-badge condition-${p.condition?.toLowerCase()}`}>
                              {p.condition || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`treatment-status-badge ${p.treatmentStatus === 'Treatment Completed' ? 'completed' : 'not-completed'}`}>
                              {p.treatmentStatus || 'Treatment Not Completed'}
                            </span>
                          </td>
                          <td>
                            {p.nextVisit && p.nextVisit !== 'Not Required' && p.nextVisit !== 'Not Assigned' ? (
                              <div className="next-visit-cell">
                                <span className={`next-visit-date ${isVisitToday ? 'today' : 'future'}`}>
                                  <FaCalendarAlt /> {p.nextVisit}
                                </span>
                                {isVisitToday && <span className="visit-today-badge">Today</span>}
                              </div>
                            ) : (
                              <span className="no-visit">Not Scheduled</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-tag ${isCompleted ? 'completed' : 'pending'}`}>
                              {isCompleted ? '✅ Completed' : '⏳ Pending'}
                            </span>
                          </td>
                          <td>{formatCurrency(totalCharges)}</td>
                          <td>{formatCurrency(p.totalPaid || 0)}</td>
                          <td>
                            <span className={`pending-badge ${pending > 0 ? 'pending' : 'paid'}`}>
                              {formatCurrency(pending)}
                            </span>
                          </td>
                          <td>{p.lastVisitDate || p.date}</td>
                          <td>
                            <button 
                              className="btn-delete-patient" 
                              onClick={() => handleDeletePatient(p.id)}
                              title="Delete Patient"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-container">
                <h3>Admin Master Logs</h3>
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Txn ID</th>
                      <th>Patient</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Method</th>
                      <th>UTR Number</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td>{t.patientName}</td>
                        <td>{formatCurrency(t.amount)}</td>
                        <td>
                          <span className={`txn-type ${t.type.toLowerCase().replace(/\s+/g, '-')}`}>
                            {t.type}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-method ${t.method}`}>
                            {t.method.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {t.method === 'upi' ? (
                            <code className="utr-code">{t.utrNumber || 'N/A'}</code>
                          ) : (
                            <span className="utr-na">N/A</span>
                          )}
                        </td>
                        <td>{t.date}</td>
                        <td>
                          <button className="btn-print-sm" onClick={() => handlePrint(t)}>
                            <FaPrint />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* --- COMPLETE MEDICAL HISTORY MODAL --- */}
      {historyTarget && (
        <div className="modal-overlay">
          <div className="modal history-modal">
            <div className="modal-header">
              <h2><FaIdCard /> Complete Medical History: {historyTarget.name}</h2>
              <button className="close-x" onClick={() => setHistoryTarget(null)}><FaTimes /></button>
            </div>
            <div className="history-scroll-area">
              {/* Patient Basic Information */}
              <div className="patient-profile">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <FaUserInjured size={40} />
                  </div>
                  <div className="profile-info">
                    <h3>{historyTarget.name}</h3>
                    <div className="profile-details">
                      <span><strong>Age:</strong> {historyTarget.age} years</span>
                      <span><strong>Village:</strong> {historyTarget.village}</span>
                      <span><strong>Phone:</strong> {historyTarget.phone}</span>
                      <span><strong>Registered:</strong> {historyTarget.date}</span>
                    </div>
                  </div>
                  <div className="profile-status">
                    <span className={`condition-badge condition-${historyTarget.condition?.toLowerCase()}`}>
                      {historyTarget.condition || 'Pending'}
                    </span>
                    <span className={`status-tag ${historyTarget.status.toLowerCase().replace(/ /g, "-")}`}>
                      {historyTarget.status}
                    </span>
                    <span className={`treatment-status-badge ${historyTarget.treatmentStatus === 'Treatment Completed' ? 'completed' : 'not-completed'}`}>
                      {historyTarget.treatmentStatus || 'Treatment Not Completed'}
                    </span>
                  </div>
                </div>
                {historyTarget.nextVisit && historyTarget.nextVisit !== 'Not Required' && historyTarget.nextVisit !== 'Not Assigned' && (
                  <div className={`next-visit-profile ${isToday(historyTarget.nextVisit) ? 'today' : ''}`}>
                    <FaCalendarAlt /> Next Visit: {historyTarget.nextVisit}
                    {isToday(historyTarget.nextVisit) && <span className="today-indicator">Today</span>}
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div className="financial-summary">
                <h3><FaFileInvoiceDollar /> Financial Summary</h3>
                <div className="summary-cards">
                  <div className="summary-card">
                    <h4>Total Charges</h4>
                    <p className="amount">{formatCurrency(getTotalCharges(historyTarget))}</p>
                  </div>
                  <div className="summary-card">
                    <h4>Amount Paid</h4>
                    <p className="amount paid">{formatCurrency(historyTarget.totalPaid || 0)}</p>
                  </div>
                  <div className="summary-card">
                    <h4>Pending Amount</h4>
                    <p className="amount pending">{formatCurrency(getPendingAmount(historyTarget))}</p>
                  </div>
                </div>
              </div>

              {/* Treatment History */}
              <div className="treatment-history">
                <div className="treatment-history-header">
                  <h3><FaHistory /> Treatment History</h3>
                  <button 
                    className="btn-add-history" 
                    onClick={() => {
                      setSelectedPatient(historyTarget);
                      setView('treat');
                      setHistoryTarget(null);
                    }}
                  >
                    <FaEdit /> Add New Treatment
                  </button>
                </div>
                {historyTarget.history && historyTarget.history.length > 0 ? (
                  <div className="history-timeline">
                    {historyTarget.history.map((h, i) => (
                      <div key={i} className="history-card">
                        <div className="card-header">
                          <span className="visit-date">{h.date}</span>
                          <span className={`visit-type ${h.type.includes('Scanning') ? 'scan' : h.type.includes('Operation') ? 'op' : 'checkup'}`}>
                            {h.type}
                          </span>
                          <span className="visit-charges">{formatCurrency(h.charges || 0)}</span>
                          {role === 'admin' && isAdminLoggedIn && (
                            <div className="history-actions">
                              <button 
                                className="btn-edit-history" 
                                onClick={() => handleEditHistory(historyTarget, i)}
                                title="Edit this treatment record"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="btn-delete-history" 
                                onClick={() => handleDeleteHistory(historyTarget.id, i)}
                                title="Delete this treatment record"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="card-content">
                          <div className="medical-details">
                            {h.diagnosis && (
                              <div className="detail-section">
                                <h5><FaNotesMedical /> Diagnosis</h5>
                                <p>{h.diagnosis}</p>
                              </div>
                            )}
                            
                            {h.healthAdvice && (
                              <div className="detail-section">
                                <h5><FaHeartbeat /> Health Advice</h5>
                                <p>{h.healthAdvice}</p>
                              </div>
                            )}
                            
                            {h.medicines && (
                              <div className="detail-section">
                                <h5><FaSyringe /> Medicines</h5>
                                <p>{h.medicines}</p>
                              </div>
                            )}
                            
                            {h.labTests && (
                              <div className="detail-section">
                                <h5><FaClipboardCheck /> Lab Tests</h5>
                                <p>{h.labTests}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="card-footer">
                            <div className="condition-info">
                              <span className={`condition-badge condition-${h.condition?.toLowerCase()}`}>
                                {h.condition}
                              </span>
                              <span className={`treatment-status-badge ${h.treatmentStatus === 'Treatment Completed' ? 'completed' : 'not-completed'}`}>
                                {h.treatmentStatus || 'Treatment Not Completed'}
                              </span>
                              <span>Next Visit: {h.nextVisit}</span>
                              {h.opStatus && (
                                <span className={`op-status ${h.opStatus.toLowerCase()}`}>
                                  Status: {h.opStatus}
                                </span>
                              )}
                            </div>
                            <div className="charge-details">
                              {h.scanningType && (
                                <span className="charge-item">Scanning: {formatCurrency(h.scanningCost)}</span>
                              )}
                              {h.opAmount > 0 && (
                                <span className="charge-item">Surgery: {formatCurrency(h.opAmount)}</span>
                              )}
                              {h.extraCharges > 0 && (
                                <span className="charge-item">Services: {formatCurrency(h.extraCharges)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-msg">No treatment records found for this patient.</p>
                )}
              </div>

              {/* Payment History */}
              <div className="payment-history">
                <h3><FaMoneyBillWave /> Payment History</h3>
                {getPatientTransactions(historyTarget.name).length > 0 ? (
                  <div className="payment-list">
                    {getPatientTransactions(historyTarget.name).map(t => (
                      <div key={t.id} className="payment-item">
                        <div className="payment-info">
                          <span className="payment-date">{t.date}</span>
                          <span className={`payment-type ${t.type.toLowerCase().replace(/\s+/g, '-')}`}>
                            {t.type}
                          </span>
                          <span className={`payment-method ${t.method}`}>
                            {t.method.toUpperCase()}
                          </span>
                          {t.utrNumber && (
                            <span className="payment-utr">UTR: {t.utrNumber}</span>
                          )}
                        </div>
                        <div className="payment-amount">
                          <strong>{formatCurrency(t.amount)}</strong>
                          <button 
                            className="btn-print-sm" 
                            onClick={() => handlePrint(t)}
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-msg">No payment records found for this patient.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="history-actions">
                <button 
                  className="btn-primary" 
                  onClick={() => printMedicalReport(historyTarget)}
                >
                  <FaFilePdf /> Print Complete Report
                </button>
                <button 
                  className="btn-outline" 
                  onClick={() => setPatientHistoryModal(historyTarget.name)}
                >
                  <FaFileInvoiceDollar /> View Payment Details
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={() => setHistoryTarget(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INDIVIDUAL PATIENT PAYMENT HISTORY MODAL --- */}
      {patientHistoryModal && (
        <div className="modal-overlay">
          <div className="modal patient-payment-history-modal">
            <div className="modal-header">
              <h2>
                <FaFileInvoiceDollar /> Payment History: {patientHistoryModal}
              </h2>
              <button className="close-x" onClick={() => setPatientHistoryModal(null)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="patient-payment-summary">
              <div className="summary-card">
                <h4>Total Payments</h4>
                <p className="summary-amount">
                  {formatCurrency(getPatientTransactions(patientHistoryModal).reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
              <div className="summary-card">
                <h4>Transactions</h4>
                <p className="summary-count">
                  {getPatientTransactions(patientHistoryModal).length}
                </p>
              </div>
              <div className="summary-card">
                <h4>Last Payment</h4>
                <p className="summary-date">
                  {getPatientTransactions(patientHistoryModal)[0]?.date || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="payment-history-list">
              <h3 className="sub-title">All Transactions</h3>
              {getPatientTransactions(patientHistoryModal).length > 0 ? (
                <table className="payment-detail-table">
                  <thead>
                    <tr>
                      <th>Txn ID</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Method</th>
                      <th>UTR Number</th>
                      <th>Amount</th>
                      <th>Print</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPatientTransactions(patientHistoryModal).map(t => (
                      <tr key={t.id}>
                        <td><code>{t.id}</code></td>
                        <td>{t.date}</td>
                        <td>
                          <span className={`txn-type ${t.type.toLowerCase().replace(/\s+/g, '-')}`}>
                            {t.type}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-method ${t.method}`}>
                            {t.method.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {t.method === 'upi' ? (
                            <code>{t.utrNumber || 'N/A'}</code>
                          ) : 'N/A'}
                        </td>
                        <td className="amount-col">
                          <strong>{formatCurrency(t.amount)}</strong>
                        </td>
                        <td>
                          <button 
                            className="btn-print-sm" 
                            onClick={() => {
                              setPatientHistoryModal(null);
                              handlePrint(t);
                            }}
                          >
                            <FaPrint /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-msg">No payment records found for this patient.</p>
              )}
            </div>
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setPatientHistoryModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PRINTABLE RECEIPT MODAL --- */}
      {showPrintModal && selectedReceipt && (
        <div className="modal-overlay receipt-overlay">
          <div className="receipt-container">
            <div className="receipt-paper">
              <div className="receipt-header">
                <FaHospital size={30} />
                <h2>MEDICARE PRO HOSPITAL</h2>
                <p>123 Health Street, City Center • Phone: 9876543210</p>
              </div>
              <div className="receipt-body">
                <div className="receipt-row"><strong>Receipt No:</strong> <span>{selectedReceipt.id}</span></div>
                <div className="receipt-row"><strong>Date:</strong> <span>{selectedReceipt.date}</span></div>
                <div className="receipt-row"><strong>Patient Name:</strong> <span>{selectedReceipt.patientName}</span></div>
                <div className="receipt-row"><strong>Payment Type:</strong> <span>{selectedReceipt.type}</span></div>
                <div className="receipt-row"><strong>Payment Mode:</strong> <span>{selectedReceipt.method.toUpperCase()}</span></div>
                {selectedReceipt.method === 'upi' && selectedReceipt.utrNumber && (
                  <div className="receipt-row"><strong>UTR Number:</strong> <span>{selectedReceipt.utrNumber}</span></div>
                )}
                <div className="receipt-divider"></div>
                <div className="receipt-row total">
                  <strong>TOTAL AMOUNT:</strong> 
                  <span className="total-amount">{formatCurrency(selectedReceipt.amount)}</span>
                </div>
                <div className="receipt-row">
                  <strong>Amount in Words:</strong> 
                  <span>{selectedReceipt.amount} Rupees Only</span>
                </div>
              </div>
              <div className="receipt-footer">
                <p>** This is a computer generated receipt **</p>
                <p>Wishing you a speedy recovery!</p>
                <div className="signature">
                  <p>Authorized Signature</p>
                  <p>___________________</p>
                </div>
              </div>
            </div>
            <div className="modal-actions no-print">
              <button className="btn-save" onClick={triggerBrowserPrint}>
                <FaPrint /> Print Receipt
              </button>
              <button className="btn-cancel" onClick={() => setShowPrintModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MEDICAL REPORT MODAL --- */}
      {showMedicalReportModal && (
        <div className="modal-overlay">
          <div className="modal medical-report-modal">
            <div className="modal-header">
              <h2><FaFilePdf /> Medical Report: {showMedicalReportModal.name}</h2>
              <button className="close-x" onClick={() => setShowMedicalReportModal(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="report-preview">
              <div className="report-header">
                <h3>MEDICARE PRO HOSPITAL</h3>
                <p>Complete Medical Report</p>
              </div>
              
              <div className="report-section">
                <h4>Patient Information</h4>
                <div className="patient-info-grid">
                  <div><strong>Name:</strong> {showMedicalReportModal.name}</div>
                  <div><strong>Age:</strong> {showMedicalReportModal.age} years</div>
                  <div><strong>Village:</strong> {showMedicalReportModal.village}</div>
                  <div><strong>Phone:</strong> {showMedicalReportModal.phone}</div>
                  <div><strong>Condition:</strong> {showMedicalReportModal.condition}</div>
                  <div><strong>Treatment Status:</strong> {showMedicalReportModal.treatmentStatus || 'Not Completed'}</div>
                  <div><strong>Next Visit:</strong> {showMedicalReportModal.nextVisit || 'Not Assigned'}</div>
                </div>
              </div>
              
              <div className="report-section">
                <h4>Treatment Summary</h4>
                {showMedicalReportModal.history && showMedicalReportModal.history.length > 0 ? (
                  <table className="treatment-summary-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Diagnosis</th>
                        <th>Medicines</th>
                        <th>Condition</th>
                        <th>Next Visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showMedicalReportModal.history.slice(0, 3).map((h, i) => (
                        <tr key={i}>
                          <td>{h.date}</td>
                          <td>{h.diagnosis || 'N/A'}</td>
                          <td>{h.medicines || 'N/A'}</td>
                          <td>{h.condition}</td>
                          <td>{h.nextVisit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No treatment history available.</p>
                )}
              </div>
              
              <div className="report-section">
                <h4>Financial Summary</h4>
                <div className="financial-summary-grid">
                  <div><strong>Total Charges:</strong> {formatCurrency(getTotalCharges(showMedicalReportModal))}</div>
                  <div><strong>Amount Paid:</strong> {formatCurrency(showMedicalReportModal.totalPaid || 0)}</div>
                  <div><strong>Pending Amount:</strong> {formatCurrency(getPendingAmount(showMedicalReportModal))}</div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-primary" 
                onClick={() => {
                  printMedicalReport(showMedicalReportModal);
                  setShowMedicalReportModal(null);
                }}
              >
                <FaFilePdf /> Generate Complete Report
              </button>
              <button 
                className="btn-cancel" 
                onClick={() => setShowMedicalReportModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal payment-modal">
            <div className="modal-header">
              <h2>Process Payment</h2>
              <button className="close-x" onClick={() => {
                setShowPaymentModal(false);
                setUpiUTR('');
              }}><FaTimes /></button>
            </div>
            
            <div className="payment-patient-info">
              <strong>{processingPatient?.name}</strong>
              <small>
                {processingPatient?.isInitial ? 'Registration' : 
                 processingPatient?.isOpCharge ? 'Operation Fee' : 
                 processingPatient?.isScanCharge ? 'Scanning Fee' : 'Service Charges'}
              </small>
            </div>
            
            <div className="total-box">
              Amount Due: <span>{formatCurrency(processingPatient?.amount)}</span>
            </div>
            
            <div className="payment-method-section">
              <label>Select Payment Method:</label>
              <div className="payment-grid">
                {paymentMethods.map(method => (
                  <button 
                    key={method.value}
                    className={`payment-method-btn ${paymentType === method.value ? 'active' : ''}`}
                    onClick={() => {
                      setPaymentType(method.value);
                      if (method.value === 'cash') {
                        setUpiUTR('');
                      }
                    }}
                    type="button"
                  >
                    {method.icon} {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI UTR Number Input */}
            {paymentType === 'upi' && (
              <div className="upi-utr-section">
                <label htmlFor="utr-number">Enter UTR Number *</label>
                <input
                  id="utr-number"
                  type="text"
                  placeholder="Enter UPI Transaction UTR Number"
                  value={upiUTR}
                  onChange={(e) => setUpiUTR(e.target.value)}
                  className="utr-input"
                  required
                  autoFocus
                />
                <small className="form-hint">
                  Enter the UTR/Reference number from the UPI payment transaction
                </small>
            </div>
            )}

            <div className="payment-info-note">
              {paymentType === 'cash' && (
                <p className="info-text">
                  <FaMoneyBillWave /> Collect cash from patient and confirm payment
                </p>
              )}
              {paymentType === 'upi' && (
                <p className="info-text">
                  <FaQrcode /> Transaction ID will start with <strong>UPI-</strong>
                </p>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={finalizePayment}>
                {paymentType === 'upi' ? 'Confirm UPI Payment' : 'Confirm Cash Payment'}
              </button>
              <button className="btn-cancel" onClick={() => {
                setShowPaymentModal(false);
                setUpiUTR('');
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN */}
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="modal admin-login-modal">
            <form onSubmit={handleAdminLogin}>
              <h2><FaChartBar /> Admin Access</h2>
              <div className="admin-input-group">
                <label>Username</label>
                <input 
                  placeholder="Enter admin username" 
                  required 
                  value={adminCreds.username}
                  onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} 
                />
              </div>
              <div className="admin-input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter admin password" 
                  required 
                  value={adminCreds.password}
                  onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} 
                />
              </div>
              <div className="modal-actions">
                <button className="btn-save">Login</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAdminLogin(false)}>
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="logout-confirmation">
              <FaSignOutAlt size={40} className="logout-icon" />
              <h2>Confirm Logout</h2>
              <p>
                {logoutTarget === 'admin' 
                  ? 'Are you sure you want to logout from Admin panel?' 
                  : 'Are you sure you want to logout? All data will be cleared!'}
              </p>
              <div className="modal-actions">
                <button className="btn-save" onClick={confirmLogout}>
                  Yes, Logout
                </button>
                <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;