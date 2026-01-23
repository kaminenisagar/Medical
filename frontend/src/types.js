// FormStep type
/**
 * @typedef {'receipt' | 'scrutiny' | 'hearing' | 'dispatch' | 'dashboard'} FormStep
 */

/**
 * @typedef {Object} AppealRecord
 * @property {string} id
 * @property {string} appealNo
 * @property {string} applicantName
 * @property {'receipt' | 'scrutiny' | 'hearing' | 'dispatch' | 'completed'} status
 * @property {string} submissionDate
 * @property {ReceiptFormData=} receiptForm
 * @property {ScrutinyFormData=} scrutinyForm
 * @property {PersonalHearingFormData=} hearingForm
 * @property {DispatchFormData=} dispatchForm
 */

/**
 * @typedef {Object} ApplicantInfo
 * @property {string} panGstinNo
 * @property {string} applicantType
 * @property {string} otherApplicantType
 * @property {string} appealNo
 * @property {string} arnNo
 * @property {string} legalName
 * @property {string} tradeName
 * @property {string} nameOfAppellant
 * @property {string} nameOfAuthorizedRepresentative
 * @property {string} completeAddress
 * @property {string} emailAddress
 * @property {string} mobileNumber
 */

/**
 * @typedef {Object} OrderDetails
 * @property {string} orderNumber
 * @property {string} orderDate
 * @property {string} dateOfCommunication
 * @property {string} dateOfFilingOfAppeal
 * @property {string} originalAdjudicatoryAuthority
 * @property {string} selectTypeOfOrder
 * @property {string} otherTypeOfOrder
 * @property {string} igstAmount
 * @property {string} cgstAmount
 * @property {string} sgstAmount
 * @property {string} cessAmount
 * @property {number} totalAmount
 * @property {string} amountInWords
 * @property {string} receivedOrder
 */

/**
 * @typedef {Object} GroundsOfAppeal
 * @property {string} briefFactsOfAppeal
 * @property {string} otherBriefFacts
 * @property {string} groundsOfAppealPointwise
 * @property {string} prayerReliefSought
 */

/**
 * @typedef {Object} DocumentUploads
 * @property {File|null} copyOfImpugnedOrder
 * @property {File|null} proofOfPreDepositPayment
 * @property {File|null} authorizationLetter
 * @property {File[]} additionalSupportingDocuments
 */

/**
 * @typedef {ApplicantInfo & OrderDetails & GroundsOfAppeal & DocumentUploads} ReceiptFormData
 */

/**
 * @typedef {Object} ScrutinyFormData
 * @property {string} isScrutinyDone
 * @property {string} scrutinyDate
 * @property {string} name
 * @property {string} designation
 * @property {string} ssoId
 * @property {string} remarks
 */

/**
 * @typedef {Object} PersonalHearingFormData
 * @property {string} personalHearingIssued
 * @property {string} statusOfPH
 * @property {string} date1
 * @property {string} date2
 * @property {string} date3
 * @property {string} date4
 * @property {string} draftOIA
 * @property {string} fileAssignedTo
 * @property {string} typeOfHearing
 * @property {string} fileAccess
 */

/**
 * @typedef {Object} DispatchFormData
 * @property {string} decision
 * @property {string} dinNumber
 * @property {string} dinDate
 * @property {string} oiaIssuedBy
 * @property {string} igstAllowed
 * @property {string} igstRejected
 * @property {string} cgstAllowed
 * @property {string} cgstRejected
 * @property {string} sgstAllowed
 * @property {string} sgstRejected
 * @property {string} cessAllowed
 * @property {string} cessRejected
 * @property {string} totalAmountPerOrder
 * @property {string} apl04Issued
 * @property {string} oiaDispatched
 * @property {string} speedPostDate
 * @property {string} remarks
 */

export {};