import React from 'react';

const GSTAppealScrutinyNotesheet = () => {
  // Function to create writing lines (retained for structure, though not directly used in the print logic)
  const WritingLines = ({ count = 1 }) => (
    <div className="writing-lines">
      {Array(count).fill().map((_, i) => (
        <div key={i} className="writing-line"></div>
      ))}
    </div>
  );

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="gst-appeal-form" style={{
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <style>{`
        .gst-appeal-form table {
          width: 100%;
          border-collapse: collapse;
        }
        .gst-appeal-form th,
        .gst-appeal-form td {
          border: 1px solid black;
          padding: 8px;
          vertical-align: top;
        }
        .writing-lines {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 4px;
        }
        .writing-line {
          height: 20px;
          border-bottom: 1px solid #333;
        }
        .signature-line {
          width: 200px;
          border-top: 1px solid black;
          margin: 0 auto;
        }
        /* Media query to hide the print button when printing */
        @media print {
          .print-button {
            display: none;
          }
        }
      `}</style>

      <h1 style={{
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        अपील संख्या/ Appeal No. 349/2024-HYD-GST-ADC
      </h1>

      <div style={{ marginBottom: '15px' }}>
        <p>
          <strong>विषय:</strong> जीएसटी- मेसर्स एफएनसी एजेंसियां एलएलपी द्वारा केंद्रीय कर के सहायक आयुक्त, अमीरपेट जीएसटी डिवीजन,
          हैदराबाद जीएसटी आयुक्तालय द्वारा पारित आदेश-इन-ओरिजिनल संख्या 61/2024-25-जीएसटी-एसी दिनांक 29-07-2024 के
          खिलाफ अपील दायर की गई - पावती जारी करना-रेग।
        </p>
        <p>
          <strong>Sub:</strong> GST- Appeal filed by M/s FNC Agencies LLP, against Order-in-Original No. 61/2024-25-GST-AC
          Dt. 29-07-2024 passed by the Assistant Commissioner of Central Tax, Ameerpet GST Division,
          Hyderabad GST Commissionerate– Issue of Acknowledgment -Reg.
        </p>
      </div>

      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        अपील का विवरण निम्नानुसार है/Details of the appeal are as under:
      </p>

      <table>
        <tbody>
          {/* Row 1 */}
          <tr>
            <td style={{ width: '5%', textAlign: 'center' }}>1</td>
            <td style={{ width: '40%' }}>अपीलार्थी का नाम एवं पता/Name & Address of the appellant</td>
            <td style={{ width: '55%' }}></td>
          </tr>

          {/* Row 2 */}
          <tr>
            <td style={{ textAlign: 'center' }}>2</td>
            <td>प्राधिकरण निर्णयन का पता/Address of the adjudicating authority</td>
            <td></td>
          </tr>

          {/* Row 3 */}
          <tr>
            <td style={{ textAlign: 'center' }}>3</td>
            <td>
              मूल आदेश की संख्या एवं तारीख जिसके विरुद्ध अपील दायर किया गया/Order-In-Original /B.E. No. &
              Date against which appeal filed
            </td>
            <td></td>
          </tr>

          {/* Row 4 */}
          <tr>
            <td style={{ textAlign: 'center' }}>4</td>
            <td>
              अपीलार्थी को मूल आदेश प्राप्ति की तारीख/Date of service of the Order-In-Original/date of OOC
              (as per C.A.-1) form)
            </td>
            <td></td>
          </tr>

          {/* Row 5 */}
          <tr>
            <td style={{ textAlign: 'center' }}>5</td>
            <td>अपील प्राप्ति की तारीख/Date of receipt of the appeal</td>
            <td></td>
          </tr>

          {/* Row 6 */}
          <tr>
            <td style={{ textAlign: 'center' }}>6</td>
            <td>
              <p>(a) क्या अपील समय से दायर किया है?/Whether the appeal is in time?</p>
              <p style={{ marginTop: '10px' }}>(b) यदि नहीं, माफी के लिए निवेदन दायर किया या नहीं/If not, request for Condonation of delay filed or not?</p>
            </td>
            <td></td>
          </tr>

          {/* Row 7 */}
          <tr>
            <td style={{ textAlign: 'center' }}>7</td>
            <td>
              क्या अच्छी तरह से डाक टिकट लगा है एवं अपील प्रतिलिपि में दायर किया है?/Whether the appeal is properly
              stamped and whether the appeal is filed in duplicate?
            </td>
            <td></td>
          </tr>

          {/* Row 8 */}
          <tr>
            <td style={{ textAlign: 'center' }}>8</td>
            <td>
              क्या मूल आदेश जिसके विरुद्ध अपील दायर किया गया डाक टिकट लगा है?Whether the Order-In-Original
              against which appeal filed is duly stamped?
            </td>
            <td></td>
          </tr>

          {/* Row 9 */}
          <tr>
            <td style={{ textAlign: 'center' }}>9</td>
            <td>
              <p>(a) क्या पार्टी ने अपनी तरफ से किसी को प्रतिनिधि के रूपमें प्राधिकृत किया है यदि ऐसा है, तो उसका नाम एवं पता
              उल्लेख करे ?/Whether the party has authorized anyone to act as representative? If so, mention
              the name and address.</p>
              <p style={{ marginTop: '10px' }}>(b) क्या उसके पक्ष में वैध अनुमति है?/Whether there is a valid authorization in his favour?</p>
            </td>
            <td></td>
          </tr>

          {/* Row 10 */}
          <tr>
            <td style={{ textAlign: 'center' }}>10</td>
            <td>
              शुल्क, दंड एवं जुर्माना का ब्यौरा जो अधिरोपित किया गया/Particulars of demand of duty, penalty / fine
              imposed
            </td>
            <td></td>
          </tr>

          {/* Row 11 */}
          <tr>
            <td style={{ textAlign: 'center' }}>11</td>
            <td>संक्षिप्त में मुद्दा/Issue in brief</td>
            <td></td>
          </tr>

          {/* Row 12 */}
          <tr>
            <td style={{ textAlign: 'center' }}>12</td>
            <td>
              यदि कॉलम 10 की राशि भुगतान किया गया है, तो भुगतान का विवरण/Whether the amount in Col.10 paid, if
              so particulars of payment
            </td>
            <td></td>
          </tr>

          {/* Row 13 */}
          <tr>
            <td style={{ textAlign: 'center' }}>13</td>
            <td>क्या निजी सुनवाई का अनुरोध किया गया है?/Whether personal hearing requested?</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <p>
          अपीलकर्ताओं को अपील स्वीकार करने, व्यक्तिगत सुनवाई की अनुसूची की सूचना देने और यदि कोई विसंगतियां
          हों तो उन्हें सूचित करने तथा न्यायाधिकरण/जेएसी/जेआरओ को अपील की एक प्रति संलग्न करने तथा पैरा-वार टिप्पणियों के
          साथ केस फाइल/रिकॉर्ड को अग्रेषित करने का अनुरोध करने वाले पत्र अवलोकन और अनुमोदन के लिए प्रस्तुत किए जाते हैं।
        </p>
        <p style={{ marginTop: '10px' }}>
          Letters to the appellants acknowledging the Appeal, intimating the schedule of personal
          hearing and communicating discrepancies noticed if any, and to the adjudicating authority/JAC/JRO
          enclosing a copy of appeal and requesting to forward case files/records along with Para-wise comments
          are put up for perusal and approval please.
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '40px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="signature-line"></div>
          <p>इंस्पेक्टर/Inspector</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="signature-line"></div>
          <p>अधीक्षक/Superintendent</p>
        </div>
      </div>

      {/* Print Button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          className="print-button"
          onClick={handlePrint}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Print Notesheet
        </button>
      </div>
    </div>
  );
};

export default GSTAppealScrutinyNotesheet;