document.addEventListener('DOMContentLoaded', function() {
  // Initialize collapsible sections
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach(collapsible => {
    // Collapse all by default
    const content = collapsible.nextElementSibling;
    if (content && content.classList.contains('collapsible-content')) {
      content.classList.remove('show');
    }
    
    // Add click handlers
    collapsible.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      if (content && content.classList.contains('collapsible-content')) {
        if (content.classList.contains('show')) {
          content.classList.remove('show');
        } else {
          content.classList.add('show');
        }
      }
    });
  });
  // Get step elements
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');

  // Get indicator elements
  const indicator1 = document.getElementById('stepIndicator1');
  const indicator2 = document.getElementById('stepIndicator2');
  const indicator3 = document.getElementById('stepIndicator3');
  const indicator4 = document.getElementById('stepIndicator4');

  // Get buttons
  const startCancelButton = document.getElementById('startCancelButton'); // Fixed name
  const step1NextButton = document.getElementById('step1NextButton');
  const step2BackButton = document.getElementById('step2BackButton');
  const step2NextButton = document.getElementById('step2NextButton');
  const step3BackButton = document.getElementById('step3BackButton');
  const step3NextButton = document.getElementById('step3NextButton');
  const step4BackButton = document.getElementById('step4BackButton');
  const resetButton = document.getElementById('resetButton');

  // Get special elements
  const existingContractInfo = document.getElementById('existingContractInfo');
  const notSureInfo = document.getElementById('notSureInfo');
  const resultDisplay = document.getElementById('resultDisplay');

  // Global state to track user selections
  let userSelections = {
    purchaseType: '',
    existingContract: '',
    value: '',
    specialized: '',
    singleSource: '',
    emergency: '',
    exception: 'none'
  };

  // Function to update the active step indicator
  function updateStepIndicator(activeStep) {
    // Remove active class from all indicators
    [indicator1, indicator2, indicator3, indicator4].forEach(indicator => {
      indicator.classList.remove('active');
    });

    // Add active class to the current step indicator
    if (activeStep === 1) indicator1.classList.add('active');
    else if (activeStep === 2) indicator2.classList.add('active');
    else if (activeStep === 3) indicator3.classList.add('active');
    else if (activeStep === 4) indicator4.classList.add('active');
  }

  // Function to show a specific step
  function showStep(stepNumber) {
    // Hide all steps
    [step1, step2, step3, step4].forEach(step => {
      step.style.display = 'none';
    });

    // Handle both string IDs like 'step1' and number IDs like 1
    let stepToShow;
    let stepNumberForIndicator;
    
    if (typeof stepNumber === 'string' && stepNumber.startsWith('step')) {
      // If it's a string like 'step1', extract the number
      const stepId = stepNumber;
      stepNumberForIndicator = parseInt(stepId.replace('step', ''));
      stepToShow = document.getElementById(stepId);
    } else if (typeof stepNumber === 'number') {
      // If it's a number like 1, 2, 3, 4
      stepNumberForIndicator = stepNumber;
      if (stepNumber === 1) stepToShow = step1;
      else if (stepNumber === 2) stepToShow = step2;
      else if (stepNumber === 3) stepToShow = step3;
      else if (stepNumber === 4) stepToShow = step4;
    }

    // Show the requested step
    if (stepToShow) {
      stepToShow.style.display = 'block';
    }

    // Update the step indicator
    updateStepIndicator(stepNumberForIndicator);
  }

  // Function to reset the form
  function resetForm() {
    // Reset selection state
    userSelections = {
      purchaseType: '',
      existingContract: '',
      value: '',
      specialized: '',
      singleSource: '',
      emergency: '',
      exception: 'none'
    };

    // Reset the dropdowns
    document.getElementById('purchaseType').value = '';
    document.getElementById('exception').value = 'none';
    
    // Reset all radio buttons
    const radioGroups = ['existingContract', 'value', 'specialized', 'singleSource', 'emergency'];
    radioGroups.forEach(groupName => {
      const radios = document.getElementsByName(groupName);
      for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
      }
    });
    
    // Hide info panels
    existingContractInfo.style.display = 'none';
    notSureInfo.style.display = 'none';
    document.getElementById('fmdMessage').style.display = 'none';
    
    // Make sure the Next button is visible
    step1NextButton.style.display = 'inline-block';
    
    // Show step 1
    showStep(1);
  }

  // Step 1: Cancel Button
  startCancelButton.addEventListener('click', function() {
    // Reset the form
    resetForm();
  });

  // Step 1: Next Button
  step1NextButton.addEventListener('click', function() {
    const purchaseType = document.getElementById('purchaseType').value;
    
    if (!purchaseType) {
      alert('Please select a procurement type.');
      return;
    }
    
    // Check if this is a construction/renovation-related purchase
    if (purchaseType === 'construction') {
      // Show the FMD message inside the form
      document.getElementById('fmdMessage').style.display = 'block';
      
      // Hide the Next button
      step1NextButton.style.display = 'none';
      
      return;
    } else {
      // Hide the FMD message if a different option is selected
      document.getElementById('fmdMessage').style.display = 'none';
      
      // Show the Next button
      step1NextButton.style.display = 'inline-block';
    }
    
    // Save the selection
    userSelections.purchaseType = purchaseType;
    
    // Proceed to step 2
    showStep(2);
  });

  // Step 2: Back Button
  step2BackButton.addEventListener('click', function() {
    showStep(1);
  });

  // Step 2: Next Button
  step2NextButton.addEventListener('click', function() {
    const existingContractRadios = document.getElementsByName('existingContract');
    let selectedValue = '';
    
    for (let i = 0; i < existingContractRadios.length; i++) {
      if (existingContractRadios[i].checked) {
        selectedValue = existingContractRadios[i].value;
        break;
      }
    }
    
    if (!selectedValue) {
      alert('Please select an option.');
      return;
    }
    
    // Save the selection
    userSelections.existingContract = selectedValue;
    
    // Even if the user selected "yes" or "notSure", we should still allow them to proceed
    // to Step 3 if they want to explore other options, rather than forcing them to stay on Step 2
    showStep(3);
  });

  // Step 3: Back Button
  step3BackButton.addEventListener('click', function() {
    showStep(2);
  });

  // Helper function to check if all radio buttons in step 3 are selected
  function areAllCriteriaSelected() {
    const valueSelected = document.querySelector('input[name="value"]:checked');
    const specializedSelected = document.querySelector('input[name="specialized"]:checked');
    const singleSourceSelected = document.querySelector('input[name="singleSource"]:checked');
    const emergencySelected = document.querySelector('input[name="emergency"]:checked');
    
    return valueSelected && specializedSelected && singleSourceSelected && emergencySelected;
  }

  // Step 3: Next Button
  step3NextButton.addEventListener('click', function() {
    if (!areAllCriteriaSelected()) {
      alert('Please answer all questions.');
      return;
    }
    
    // Save all selections
    userSelections.value = document.querySelector('input[name="value"]:checked').value;
    userSelections.specialized = document.querySelector('input[name="specialized"]:checked').value;
    userSelections.singleSource = document.querySelector('input[name="singleSource"]:checked').value;
    userSelections.emergency = document.querySelector('input[name="emergency"]:checked').value;
    userSelections.exception = document.getElementById('exception').value;
    
    // Determine procurement method based on criteria
    let procurementMethod = '';
    let description = '';
    let additionalInfo = '';
    let timeline = '';
    let cooperativeInfo = '';

    // If using cooperative contract, skip directly to results
    if (userSelections.existingContract === 'yes') {
      procurementMethod = 'Use Existing Contract';
      description = 'You indicated there is an existing contract that meets your requirements. Using this contract is typically the most efficient approach.';
      additionalInfo = 'Contact University Purchasing for assistance with the order process through the existing contract.';
      timeline = 'Timeline: This is typically the fastest procurement method.';
      
      // Add cooperative procurement links
      cooperativeInfo = `
      <h3 class="mt-3">Cooperative Contract Resources:</h3>
      <p>VCU has access to the following cooperative procurement platforms:</p>
      <div class="platform-buttons">
        <a href="https://vascupp.org" target="_blank" class="platform-button vascupp-button">
          <div class="platform-button-name">VASCUPP</div>
          <div class="platform-button-desc">Virginia Association of State College & University Purchasing Professionals</div>
        </a>
        <a href="https://vhepc.cobblestone.software" target="_blank" class="platform-button vhepc-button">
          <div class="platform-button-name">VHEPC</div>
          <div class="platform-button-desc">Virginia Higher Education Procurement Consortium</div>
        </a>
        <a href="https://eva.virginia.gov" target="_blank" class="platform-button eva-button">
          <div class="platform-button-name">eVA</div>
          <div class="platform-button-desc">Virginia's eProcurement Portal</div>
        </a>
        <a href="https://vita.cobblestonesystems.com/public/" target="_blank" class="platform-button vita-button">
          <div class="platform-button-name">VITA</div>
          <div class="platform-button-desc">Virginia Information Technologies Agency Contracts</div>
        </a>
        <a href="https://www.withpavilion.com/welcome" target="_blank" class="platform-button pavilion-button">
          <div class="platform-button-name">Pavilion</div>
          <div class="platform-button-desc">Cooperative Purchasing Platform</div>
        </a>
      </div>
      <p>These platforms provide pre-competed contracts that can significantly reduce procurement time and effort.</p>
      `;
    } 
    // Handle Exception to Competition selections
    else if (userSelections.exception !== 'none') {
      const exceptionValue = userSelections.exception;
      const isCappedExceptionOver200k = exceptionValue.match(/EC(2|3|4|5|6|8|9|10|11|12|13|14|15|17|18|19|20|21|23|24|25|26|39)/) && 
        (userSelections.value === '200kTo2m' || userSelections.value === '2mTo5m' || userSelections.value === 'over5m');
      
      if (isCappedExceptionOver200k) {
        // Get the exception text for reference but don't include the EC# in the result
        const exceptionElement = document.getElementById('exception');
        const exceptionText = exceptionElement.options[exceptionElement.selectedIndex].text;
        
        // If exception is capped at $200k but value is over $200k, follow normal procurement rules
        if (userSelections.emergency === 'yes') {
          procurementMethod = 'Emergency Procurement';
          description = `Due to the emergency nature of this purchase, you should follow emergency procurement procedures. Note that your selected exception to competition "${exceptionText}" is capped at $200,000, so it cannot be used for your purchase value.`;
          additionalInfo = 'Emergency procurements require detailed justification and approval. Submit a requisition in RealSource with emergency justification explaining the immediate threat to public health, welfare, safety, or property, and why normal procurement methods cannot be used. You must document the genuine emergency nature of the situation.';
          timeline = 'Timeline: Can be expedited to 1-5 business days, depending on the urgency and Purchasing\'s approval process. Note that misuse of emergency procurement procedures for non-emergency situations may result in rejection of your request.';
        } 
        else if (userSelections.singleSource === 'yes') {
          procurementMethod = 'Sole Source Procurement';
          description = `Since only one vendor can provide this item/service, a sole source justification should be prepared to document why competitive procurement is not possible. Note that your selected exception to competition "${exceptionText}" is capped at $200,000, so it cannot be used for your purchase value.`;
          additionalInfo = 'Submit a Sole Source Justification Form along with your requisition in RealSource. University Purchasing will review and approve if it qualifies.';
          timeline = 'Timeline: A minimum of 5-15 business days after submitting the requisition and justification, due to required market analysis and documentation.';
        }
        else if (userSelections.specialized === 'yes') {
          procurementMethod = 'Request for Proposal (RFP)';
          description = `For specialized purchases over $200,000, an RFP seeks proposals and awards to the best proposal based on multiple criteria (quality, cost, vendor capability). Note that your selected exception to competition "${exceptionText}" is capped at $200,000, so it cannot be used for your purchase value and regular procurement rules apply.`;
          additionalInfo = 'Submit a requisition in RealSource. University Purchasing will conduct the RFP, including public posting, evaluation, and competitive negotiation.';
          timeline = 'Timeline: Typically 90-125+ days, depending on complexity, public posting requirements, and evaluation process.';
        } else {
          procurementMethod = 'Request for Proposal (RFP)';
          description = `For most procurements over $200,000, an RFP is suggested to ensure best value. Note that your selected exception to competition "${exceptionText}" is capped at $200,000, so it cannot be used for your purchase value and regular procurement rules apply.`;
          additionalInfo = 'Submit a requisition in RealSource. University Purchasing will conduct the RFP, including public posting, evaluation, and competitive negotiation.';
          timeline = 'Timeline: Typically 90-125+ days, depending on complexity, public posting requirements, and evaluation process.';
        }
      } else {
        // Use the exception to competition - but don't show the EC# in the description
        const exceptionElement = document.getElementById('exception');
        const exceptionText = exceptionElement.options[exceptionElement.selectedIndex].text;
        
        procurementMethod = 'Exception to Competition';
        description = `You've selected an Exception to Competition "${exceptionText}", which allows for direct procurement without competitive bidding under specific circumstances.`;
        additionalInfo = 'Submit a requisition in RealSource with detailed documentation explaining how your purchase qualifies for this exception. University Purchasing will review and approve if it meets the requirements.';
        timeline = 'Timeline: Typically 5-15 business days after submitting the requisition and supporting documentation.';
      }
    }
    // Standard procurement methods
    else if (userSelections.emergency === 'yes') {
      procurementMethod = 'Emergency Procurement';
      description = 'Due to the emergency nature of this purchase, you should follow emergency procurement procedures. This involves direct sourcing with minimal competition requirements.';
      additionalInfo = 'Emergency procurements require detailed justification and approval. Submit a requisition in RealSource with emergency justification explaining the immediate threat to public health, welfare, safety, or property, and why normal procurement methods cannot be used. You must document the genuine emergency nature of the situation.';
      timeline = 'Timeline: Can be expedited to 1-5 business days, depending on the urgency and Purchasing\'s approval process. Note that misuse of emergency procurement procedures for non-emergency situations may result in rejection of your request.';
    } 
    else if (userSelections.singleSource === 'yes') {
      procurementMethod = 'Sole Source Procurement';
      description = 'Since only one vendor can provide this item/service, a sole source justification should be prepared to document why competitive procurement is not possible.';
      additionalInfo = 'Submit a Sole Source Justification Form along with your requisition in RealSource. University Purchasing will review and approve if it qualifies.';
      timeline = 'Timeline: A minimum of 5-15 business days after submitting the requisition and justification, due to required market analysis and documentation.';
    } 
    else if (userSelections.value === 'under10k') {
      procurementMethod = 'Delegated Authority Purchase';
      description = 'For purchases under $10,000, departments have delegated authority to make purchases without involving University Purchasing.';
      additionalInfo = `<strong>Approach One</strong><br>
      1. Review vendor document(s) (SOW, quote, order form, contract) to ensure it reflects what you wish to purchase.<br>
      2. Create a Requisition in RealSource and attach vendor document(s).<br>
      3. Obtain Requisition approvals and issue a Purchase Order.<br>
      4. <strong>Do NOT sign any vendor documents.</strong><br><br>
      
      <strong>Approach Two</strong><br>
      If the vendor rejects the Purchase Order because a signature is required, submit vendor documents through the Contracts+ module in RealSource. The Contracts team will negotiate and finalize the contract.<br><br>
      
      <strong>Pcard Purchases</strong><br>
      • Follow Pcard rules and thresholds.<br>
      • If no signature is required, pay with Pcard.<br>
      • If a signature is required, send documents through Contracts+ in RealSource.<br><br>
      
      For additional options, submit a contract request via Contracts+. See the Contracts+ Help Guide on the RealSource homepage under Quick Links.`;
      timeline = 'Timeline: 1-5 business days if using a Purchase Order; potentially longer if signature/contract required.';
    } 
    else if (userSelections.value === '10kTo200k') {
      if (userSelections.specialized === 'yes') {
        procurementMethod = 'Best Value Acquisition (BVA)';
        description = 'For specialized purchases in this range, a Best Value Acquisition allows award based on multiple criteria (quality, delivery, vendor experience), not just price.';
        additionalInfo = 'Submit a requisition in RealSource. University Purchasing will manage the BVA process, soliciting at least four Small Business and Supplier Diversity (SBSD) certified firms.';
        timeline = 'Timeline: 15-60+ days, depending on the complexity of the purchase and vendor responses.';
      } else {
        procurementMethod = 'Request for Quote (RFQ)';
        description = 'For standard items/services in this value range, a Request for Quote process is used with award based on the lowest price.';
        additionalInfo = 'Submit a requisition in RealSource. University Purchasing will manage the RFQ process, soliciting at least four SBSD certified firms.';
        timeline = 'Timeline: 5-15+ days, depending on the complexity of the purchase and vendor responses.';
      }
    } 
    else if (userSelections.value === '200kTo2m' || userSelections.value === '2mTo5m' || userSelections.value === 'over5m') {
      if (userSelections.specialized === 'yes') {
        procurementMethod = 'Request for Proposal (RFP)';
        description = 'For specialized purchases over $200,000, an RFP seeks proposals and awards to the best proposal based on multiple criteria (quality, cost, vendor capability).';
        additionalInfo = 'Submit a requisition in RealSource. University Purchasing will conduct the RFP, including public posting, evaluation, and competitive negotiation.';
        timeline = 'Timeline: Typically 90-125+ days, depending on complexity, public posting requirements, and evaluation process.';
        
        if (userSelections.value === '2mTo5m') {
          additionalInfo += ' Note that procurements between $2M and $5M require approval from a higher level signer in the university leadership.';
        } else if (userSelections.value === 'over5m') {
          additionalInfo += ' Note that procurements over $5M require approval from both a higher level signer and the Board of Visitors (BOV).';
        }
      } else {
        // Prioritize RFP over IFB for most situations over $200k
        procurementMethod = 'Request for Proposal (RFP)';
        description = 'For most procurements over $200,000, an RFP is suggested to ensure best value. This allows evaluation based on multiple criteria, not just price.';
        additionalInfo = 'Submit a requisition in RealSource. University Purchasing will conduct the RFP, including public posting, evaluation, and competitive negotiation.';
        timeline = 'Timeline: Typically 90-125+ days, depending on complexity, public posting requirements, and evaluation process.';
        
        if (userSelections.value === '2mTo5m') {
          additionalInfo += ' Note that procurements between $2M and $5M require approval from a higher level signer in the university leadership.';
        } else if (userSelections.value === 'over5m') {
          additionalInfo += ' Note that procurements over $5M require approval from both a higher level signer and the Board of Visitors (BOV).';
        }
      }
    }
    
    // Mention Cooperative Procurement for all methods except when already using an existing contract
    if (userSelections.existingContract !== 'yes') {
      cooperativeInfo = `
      <h3 class="mt-3">Cooperative Contract Options:</h3>
      <p>Before proceeding with a competitive solicitation, check if your requirement can be met using an existing cooperative contract:</p>
      <div class="platform-buttons">
        <a href="https://vascupp.org" target="_blank" class="platform-button vascupp-button">
          <div class="platform-button-name">VASCUPP</div>
          <div class="platform-button-desc">Virginia Association of State College & University Purchasing Professionals</div>
        </a>
        <a href="https://vhepc.cobblestone.software" target="_blank" class="platform-button vhepc-button">
          <div class="platform-button-name">VHEPC</div>
          <div class="platform-button-desc">Virginia Higher Education Procurement Consortium</div>
        </a>
        <a href="https://eva.virginia.gov" target="_blank" class="platform-button eva-button">
          <div class="platform-button-name">eVA</div>
          <div class="platform-button-desc">Virginia's eProcurement Portal</div>
        </a>
        <a href="https://vita.cobblestonesystems.com/public/" target="_blank" class="platform-button vita-button">
          <div class="platform-button-name">VITA</div>
          <div class="platform-button-desc">Virginia Information Technologies Agency Contracts</div>
        </a>
        <a href="https://www.withpavilion.com/welcome" target="_blank" class="platform-button pavilion-button">
          <div class="platform-button-name">Pavilion</div>
          <div class="platform-button-desc">Cooperative Purchasing Platform</div>
        </a>
      </div>
      <p>Using a cooperative contract can significantly reduce procurement time and effort.</p>
      `;
    }
    
    // Build exception info if an exception was selected
    let exceptionInfo = '';
    if (userSelections.exception !== 'none') {
      const exceptionElement = document.getElementById('exception');
      const exceptionText = exceptionElement.options[exceptionElement.selectedIndex].text;
      exceptionInfo = `<li><strong>Exception to Competition:</strong> ${exceptionText}</li>`;
    }
    
    // Update the result display with more detailed information
    resultDisplay.innerHTML = `
      <h2>${procurementMethod}</h2>
      <p>${description}</p>
      <p>${additionalInfo}</p>
      <p><strong>${timeline}</strong></p>
      <div class="badge mb-3">Suggested Method</div>
      
      <h3>Key Considerations:</h3>
      <ul>
        <li><strong>Purchase Type:</strong> ${getPurchaseTypeText(userSelections.purchaseType)}</li>
        <li><strong>Existing Contract:</strong> ${getExistingContractText(userSelections.existingContract)}</li>
        <li><strong>Estimated Value:</strong> ${getValueRangeText(userSelections.value)}</li>
        <li><strong>Specialized/Unique:</strong> ${userSelections.specialized === 'yes' ? 'Yes' : 'No'}</li>
        <li><strong>Single Source:</strong> ${userSelections.singleSource === 'yes' ? 'Yes' : 'No'}</li>
        <li><strong>Emergency:</strong> ${userSelections.emergency === 'yes' ? 'Yes' : 'No'}</li>
        ${exceptionInfo}
      </ul>

      <h3 class="mt-2">Next Steps:</h3>
      <p>For most procurement situations, your first step should be to submit a requisition in RealSource or contact Purchasing for additional guidance.</p>
      <ul>
        <li>Submit a requisition in RealSource to initiate the procurement process</li>
        <li>If the vendor is not already registered in RealSource, submit a vendor request in the system</li>
        <li>Contact Procurement Services for assistance with required documentation and approvals</li>
        <li>Work with Purchasing on formal solicitation development (if applicable)</li>
        <li>Receive support with vendor identification, qualification, and contract negotiation</li>
      </ul>
      
      ${cooperativeInfo}
    `;
    
    // Proceed to step 4
    showStep(4);
  });

  // Helper function to get text description of value range
  function getValueRangeText(value) {
    switch(value) {
      case 'under10k': return 'Under $10,000 (Delegated Authority)';
      case '10kTo200k': return '$10,000 to $200,000 (Small Purchase)';
      case '200kTo2m': return '$200,000 to $2 million (Formal Process)';
      case '2mTo5m': return '$2 million to $5 million (Higher Level Signer Required)';
      case 'over5m': return 'Over $5 million (BOV Approval & Higher Level Signer Required)';
      default: return 'Not specified';
    }
  }

  // Helper function to get text description of purchase type
  function getPurchaseTypeText(type) {
    switch(type) {
      case 'standardGoods': return 'Standard Goods';
      case 'standardServices': return 'Standard Services';
      case 'standardGoodsServices': return 'Standard Goods and Services';
      case 'construction': return 'Related to construction, renovations, or other facility related purchase';
      default: return 'Not specified';
    }
  }

  // Helper function to get text description of existing contract
  function getExistingContractText(value) {
    switch(value) {
      case 'yes': return 'Yes';
      case 'no': return 'No';
      case 'notSure': return 'Not sure';
      default: return 'Not specified';
    }
  }

  // Step 4: Back Button
  step4BackButton.addEventListener('click', function() {
    showStep(3);
  });

  // Reset Button
  resetButton.addEventListener('click', function() {
    resetForm();
  });
  
  // Download Results Button
  const downloadResultButton = document.getElementById('downloadResultButton');
  downloadResultButton.addEventListener('click', function() {
    generatePDF();
  });
  
  // Function to generate and download PDF
  function generatePDF() {
    // Use jsPDF from the global window object
    const { jsPDF } = window.jspdf;
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Get current date
    const currentDate = new Date().toLocaleDateString();
    
    // Get all selected values
    const purchaseType = document.getElementById('purchaseType').value;
    const existingContract = document.querySelector('input[name="existingContract"]:checked')?.value || 'Not specified';
    const value = document.querySelector('input[name="value"]:checked')?.value || 'Not specified';
    const specialized = document.querySelector('input[name="specialized"]:checked')?.value || 'Not specified';
    const singleSource = document.querySelector('input[name="singleSource"]:checked')?.value || 'Not specified';
    const emergency = document.querySelector('input[name="emergency"]:checked')?.value || 'Not specified';
    const exception = document.getElementById('exception').value;
    
    // Get the result content - convert HTML to text
    const resultContent = document.getElementById('resultDisplay').innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resultContent;
    const resultText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Get the exception text
    let exceptionText = 'None';
    if (exception !== 'none') {
      const exceptionElement = document.querySelector(`option[value="${exception}"]`);
      if (exceptionElement) {
        exceptionText = exceptionElement.textContent;
      }
    }
    
    // VCU Blue
    const vcuBlue = [0, 75, 135];
    // VCU Gold
    const vcuGold = [248, 179, 0];
    
    // Add VCU logo
    try {
      // Add the logo image from the base64 string in logo.js
      doc.addImage(vcuLogoBase64, 'PNG', 77, 10, 56, 20);
      
      // Add title below the logo
      doc.setFontSize(18);
      doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
      doc.text('Procurement Method Suggestion', 105, 38, { align: 'center' });
    } catch (e) {
      // Fallback if logo fails to load
      doc.setFontSize(24);
      doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
      doc.text('VCU Procurement', 105, 20, { align: 'center' });
      doc.setFontSize(18);
      doc.text('Method Suggestion', 105, 30, { align: 'center' });
    }
    
    // Add a line under the header
    doc.setDrawColor(vcuGold[0], vcuGold[1], vcuGold[2]);
    doc.setLineWidth(1);
    doc.line(20, 43, 190, 43);
    
    // Add the date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate}`, 20, 50);
    
    // Section: Procurement Details
    doc.setFontSize(14);
    doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
    doc.text('Procurement Details', 20, 60);
    
    // Create a table with the procurement details
    const detailsData = [
      ['Purchase Type:', getPurchaseTypeText(purchaseType)],
      ['Existing Contract:', getExistingContractText(existingContract)],
      ['Estimated Value:', getValueRangeText(value)],
      ['Complex/Specialized:', specialized === 'yes' ? 'Yes' : 'No'],
      ['Single Source:', singleSource === 'yes' ? 'Yes' : 'No'],
      ['Emergency:', emergency === 'yes' ? 'Yes' : 'No'],
      ['Exception to Competition:', exceptionText]
    ];
    
    // Set up the table
    doc.autoTable({
      startY: 65,
      head: [],
      body: detailsData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 55, fontStyle: 'bold' },
        1: { cellWidth: 100 }
      },
      headStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Get the y position after the table
    const tableEndY = doc.lastAutoTable.finalY + 10;
    
    // Section: Suggested Procurement Method
    doc.setFontSize(14);
    doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
    doc.text('Suggested Procurement Method', 20, tableEndY);
    
    // Add the results - need to handle text wrapping
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const resultLines = doc.splitTextToSize(resultText.trim(), 170);
    doc.text(resultLines, 20, tableEndY + 10);
    
    // Calculate position for the disclaimer based on how tall the results section is
    const disclaimerY = tableEndY + 15 + (resultLines.length * 5);
    
    // Add a line before the disclaimer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, disclaimerY - 5, 190, disclaimerY - 5);
    
    // Add the disclaimer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('IMPORTANT DISCLAIMER', 20, disclaimerY);
    
    const disclaimer = 'This tool provides guidance only. Procurement Services has the ultimate authority to determine the appropriate procurement method based on a comprehensive review of your specific requirements and applicable policies.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
    doc.text(disclaimerLines, 20, disclaimerY + 5);
    
    // Contact information
    const contact = 'For assistance: Submit a requisition in RealSource to initiate the process. If the vendor is not yet registered, submit a vendor request in the system. Contact purchasing@vcu.edu for additional guidance.';
    const contactY = disclaimerY + 15 + (disclaimerLines.length * 4);
    doc.text(contact, 20, contactY);
    
    // Add a footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Page ' + i + ' of ' + pageCount, 190, 285, { align: 'right' });
    }
    
    // Save the PDF with a name
    doc.save('VCU_Procurement_Suggestion.pdf');
  }

  // Existing Contract Radio Change Event
  const existingContractRadios = document.getElementsByName('existingContract');
  for (let i = 0; i < existingContractRadios.length; i++) {
    existingContractRadios[i].addEventListener('change', function() {
      if (this.value === 'yes') {
        existingContractInfo.style.display = 'block';
        notSureInfo.style.display = 'none';
      } else if (this.value === 'notSure') {
        existingContractInfo.style.display = 'none';
        notSureInfo.style.display = 'block';
      } else {
        existingContractInfo.style.display = 'none';
        notSureInfo.style.display = 'none';
      }
    });
  }
});
