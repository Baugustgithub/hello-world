document.addEventListener('DOMContentLoaded', function() {
  // Scope all queries to #procurement-tool
  const procurementTool = document.getElementById('procurement-tool');

  // Initialize collapsible sections
  const collapsibles = procurementTool.querySelectorAll('.collapsible');
  collapsibles.forEach(collapsible => {
    const content = collapsible.nextElementSibling;
    if (content && content.classList.contains('collapsible-content')) {
      content.classList.remove('show');
    }
    collapsible.addEventListener('click', function() {
      this.classList.toggle('active');
      if (content && content.classList.contains('collapsible-content')) {
        content.classList.toggle('show');
      }
    });
  });

  // Get step elements
  const step1 = procurementTool.querySelector('#step1');
  const step2 = procurementTool.querySelector('#step2');
  const step3 = procurementTool.querySelector('#step3');
  const step4 = procurementTool.querySelector('#step4');

  // Get indicator elements
  const indicator1 = procurementTool.querySelector('#stepIndicator1');
  const indicator2 = procurementTool.querySelector('#stepIndicator2');
  const indicator3 = procurementTool.querySelector('#stepIndicator3');
  const indicator4 = procurementTool.querySelector('#stepIndicator4');

  // Get buttons
  const startCancelButton = procurementTool.querySelector('#startCancelButton');
  const step1NextButton = procurementTool.querySelector('#step1NextButton');
  const step2BackButton = procurementTool.querySelector('#step2BackButton');
  const step2NextButton = procurementTool.querySelector('#step2NextButton');
  const step3BackButton = procurementTool.querySelector('#step3BackButton');
  const step3NextButton = procurementTool.querySelector('#step3NextButton');
  const step4BackButton = procurementTool.querySelector('#step4BackButton');
  const resetButton = procurementTool.querySelector('#resetButton');
  const downloadResultButton = procurementTool.querySelector('#downloadResultButton');

  // Get special elements
  const existingContractInfo = procurementTool.querySelector('#existingContractInfo');
  const notSureInfo = procurementTool.querySelector('#notSureInfo');
  const resultDisplay = procurementTool.querySelector('#resultDisplay');

  // Global state to track user selections
  let userSelections = {
    purchaseType: '',
    existingContract: '',
    value: '',
    specialized: '',
    singleSource: '',
    emergency: '',
    sbsdCertified: '',
    exception: 'none'
  };

  // Function to update the active step indicator
  function updateStepIndicator(activeStep) {
    [indicator1, indicator2, indicator3, indicator4].forEach(indicator => {
      indicator.classList.remove('active');
    });
    if (activeStep === 1) indicator1.classList.add('active');
    else if (activeStep === 2) indicator2.classList.add('active');
    else if (activeStep === 3) indicator3.classList.add('active');
    else if (activeStep === 4) indicator4.classList.add('active');
  }

  // Function to show a specific step
  function showStep(stepNumber) {
    [step1, step2, step3, step4].forEach(step => {
      step.style.display = 'none';
    });
    let stepToShow;
    let stepNumberForIndicator;
    if (typeof stepNumber === 'string' && stepNumber.startsWith('step')) {
      stepNumberForIndicator = parseInt(stepNumber.replace('step', ''));
      stepToShow = procurementTool.querySelector(`#${stepNumber}`);
    } else if (typeof stepNumber === 'number') {
      stepNumberForIndicator = stepNumber;
      if (stepNumber === 1) stepToShow = step1;
      else if (stepNumber === 2) stepToShow = step2;
      else if (stepNumber === 3) stepToShow = step3;
      else if (stepNumber === 4) stepToShow = step4;
    }
    if (stepToShow) {
      stepToShow.style.display = 'block';
    }
    updateStepIndicator(stepNumberForIndicator);
  }

  // Function to reset the form
  function resetForm() {
    userSelections = {
      purchaseType: '',
      existingContract: '',
      value: '',
      specialized: '',
      singleSource: '',
      emergency: '',
      sbsdCertified: '',
      exception: 'none'
    };
    procurementTool.querySelector('#purchaseType').value = '';
    procurementTool.querySelector('#exception').value = 'none';
    const radioGroups = ['existingContract', 'value', 'specialized', 'singleSource', 'emergency', 'sbsdCertified'];
    radioGroups.forEach(groupName => {
      const radios = procurementTool.querySelectorAll(`input[name="${groupName}"]`);
      radios.forEach(radio => radio.checked = false);
    });
    existingContractInfo.style.display = 'none';
    notSureInfo.style.display = 'none';
    procurementTool.querySelector('#fmdMessage').style.display = 'none';
    step1NextButton.style.display = 'inline-block';
    showStep(1);
  }

  // Event Listeners
  startCancelButton.addEventListener('click', resetForm);

  step1NextButton.addEventListener('click', function() {
    const purchaseType = procurementTool.querySelector('#purchaseType').value;
    if (!purchaseType) {
      alert('Please select a procurement type.');
      return;
    }
    if (purchaseType === 'construction') {
      procurementTool.querySelector('#fmdMessage').style.display = 'block';
      step1NextButton.style.display = 'none';
      return;
    } else {
      procurementTool.querySelector('#fmdMessage').style.display = 'none';
      step1NextButton.style.display = 'inline-block';
    }
    userSelections.purchaseType = purchaseType;
    showStep(2);
  });

  step2BackButton.addEventListener('click', () => showStep(1));

  step2NextButton.addEventListener('click', function() {
    const existingContractRadios = procurementTool.querySelectorAll('input[name="existingContract"]');
    let selectedValue = '';
    existingContractRadios.forEach(radio => {
      if (radio.checked) selectedValue = radio.value;
    });
    if (!selectedValue) {
      alert('Please select an option.');
      return;
    }
    userSelections.existingContract = selectedValue;
    showStep(3);
  });

  step3BackButton.addEventListener('click', () => showStep(2));

  function areAllCriteriaSelected() {
    return !!procurementTool.querySelector('input[name="value"]:checked') &&
           !!procurementTool.querySelector('input[name="specialized"]:checked') &&
           !!procurementTool.querySelector('input[name="singleSource"]:checked') &&
           !!procurementTool.querySelector('input[name="emergency"]:checked') &&
           !!procurementTool.querySelector('input[name="sbsdCertified"]:checked');
  }

  step3NextButton.addEventListener('click', function() {
    if (!areAllCriteriaSelected()) {
      alert('Please answer all questions.');
      return;
    }
    userSelections.value = procurementTool.querySelector('input[name="value"]:checked').value;
    userSelections.specialized = procurementTool.querySelector('input[name="specialized"]:checked').value;
    userSelections.singleSource = procurementTool.querySelector('input[name="singleSource"]:checked').value;
    userSelections.emergency = procurementTool.querySelector('input[name="emergency"]:checked').value;
    userSelections.sbsdCertified = procurementTool.querySelector('input[name="sbsdCertified"]:checked').value;
    userSelections.exception = procurementTool.querySelector('#exception').value;

    // [Procurement method logic remains unchanged]
    let procurementMethod = '';
    let description = '';
    let additionalInfo = '';
    let timeline = '';
    let cooperativeInfo = '';

    if (userSelections.value === 'under10k') {
      procurementMethod = 'Delegated Authority Purchase';
      description = 'For purchases under $10,000, departments have delegated authority to make purchases without involving University Purchasing.';
      additionalInfo = `<strong>Approach One</strong><br>1. Review vendor document(s) (SOW, quote, order form, contract) to ensure it reflects what you wish to purchase.<br>2. Create a Requisition in RealSource and attach vendor document(s).<br>3. Obtain Requisition approvals and issue a Purchase Order.<br>4. <strong>Do NOT sign any vendor documents.</strong><br><br><strong>Approach Two</strong><br>If the vendor rejects the Purchase Order because a signature is required, submit vendor documents through the Contracts+ module in RealSource. The Contracts team will negotiate and finalize the contract.<br><br><strong>Pcard Purchases</strong><br>• Follow Pcard rules and thresholds.<br>• If no signature is required, pay with Pcard.<br>• If a signature is required, send documents through Contracts+ in RealSource.<br><br>For additional options, submit a contract request via Contracts+. See the Contracts+ Help Guide on the RealSource homepage under Quick Links.`;
      timeline = 'Timeline: 1-5 business days if using a Purchase Order; potentially longer if signature/contract required.';
    } else if (userSelections.existingContract === 'yes') {
      procurementMethod = 'Use Existing Contract';
      description = 'You indicated there is an existing contract that meets your requirements. Using this contract is typically the most efficient approach.';
      additionalInfo = 'Contact University Purchasing for assistance with the order process through the existing contract.';
      timeline = 'Timeline: This is typically the fastest procurement method.';
      cooperativeInfo = `
        <h3 class="mt-3">Cooperative Contract Resources:</h3>
        <p>VCU has access to the following cooperative procurement platforms:</p>
        <div class="platform-buttons">
          <a href="https://vascupp.org" target="_blank" class="platform-button vascupp-button"><div class="platform-button-name">VASCUPP</div><div class="platform-button-desc">Virginia Association of State College & University Purchasing Professionals</div></a>
          <a href="https://vhepc.cobblestone.software/public/" target="_blank" class="platform-button vhepc-button"><div class="platform-button-name">VHEPC</div><div class="platform-button-desc">Virginia Higher Education Procurement Consortium</div></a>
          <a href="https://eva.virginia.gov" target="_blank" class="platform-button eva-button"><div class="platform-button-name">eVA</div><div class="platform-button-desc">Virginia's eProcurement Portal</div></a>
          <a href="https://vita.cobblestonesystems.com/public/" target="_blank" class="platform-button vita-button"><div class="platform-button-name">VITA</div><div class="platform-button-desc">Virginia Information Technologies Agency Contracts</div></a>
          <a href="https://www.withpavilion.com/welcome" target="_blank" class="platform-button pavilion-button"><div class="platform-button-name">Pavilion</div><div class="platform-button-desc">Cooperative Purchasing Platform</div></a>
        </div>
        <p>These platforms provide pre-competed contracts that can significantly reduce procurement time and effort.</p>`;
    } else if (userSelections.exception !== 'none') {
      const exceptionValue = userSelections.exception;
      const isCappedExceptionOver200k = exceptionValue.match(/EC(2|3|4|5|6|8|9|10|11|12|13|14|15|17|18|19|20|21|23|24|25|26|39)/) && 
        (userSelections.value === '200kTo2m' || userSelections.value === '2mTo5m' || userSelections.value === 'over5m');
      if (isCappedExceptionOver200k) {
        const exceptionElement = procurementTool.querySelector('#exception');
        const exceptionText = exceptionElement.options[exceptionElement.selectedIndex].text;
        if (userSelections.emergency === 'yes') {
          procurementMethod = 'Emergency Procurement';
          description = `Due to the emergency nature of this purchase, you should follow emergency procurement procedures. Note that your selected exception to competition "${exceptionText}" is capped at $200,000, so it cannot be used for your purchase value.`;
          additionalInfo = 'Emergency procurements require detailed justification and approval. Submit a requisition in RealSource with emergency justification explaining the immediate threat to public health, welfare, safety, or property, and why normal procurement methods cannot be used. You must document the genuine emergency nature of the situation.';
          timeline = 'Timeline: Can be expedited to 1-5 business days, depending on the urgency and Purchasing\'s approval process. Note that misuse of emergency procurement procedures for non-emergency situations may result in rejection of your request.';
        } else if (userSelections.singleSource === 'yes') {
          procurementMethod = 'Sole Source Procurement';
          description = `Since only one vendor can provide this item/service, a sole source justification should be prepared to document why competitive procurement is not possible. Note that your selected exception to competition "${exceptionText}" is capped at $200,000, so it cannot be used for your purchase value.`;
          additionalInfo = 'Submit a Sole Source Justification Form along with your requisition in RealSource. University Purchasing will review and approve if it qualifies.';
          timeline = 'Timeline: A minimum of 5-15 business days after submitting the requisition and justification, due to required market analysis and documentation.';
        } else if (userSelections.specialized === 'yes') {
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
        const exceptionElement = procurementTool.querySelector('#exception');
        const exceptionText = exceptionElement.options[exceptionElement.selectedIndex].text;
        procurementMethod = 'Exception to Competition';
        description = `You've selected an Exception to Competition "${exceptionText}", which allows for direct procurement without competitive bidding under specific circumstances.`;
        additionalInfo = 'Submit a requisition in RealSource with detailed documentation explaining how your purchase qualifies for this exception. University Purchasing will review and approve if it meets the requirements.';
        timeline = 'Timeline: Typically 5-15 business days after submitting the requisition and supporting documentation.';
      }
    } else if (userSelections.sbsdCertified === 'yes' && userSelections.value === '10kTo200k' && userSelections.emergency === 'no' && userSelections.singleSource === 'no' && userSelections.exception === 'none') {
      if (userSelections.specialized === 'yes') {
        procurementMethod = 'Best Value Acquisition (BVA)';
        description = 'For specialized purchases in this range, a Best Value Acquisition allows award based on multiple criteria (quality, delivery, vendor experience), not just price.';
        additionalInfo = 'Submit a requisition in RealSource. University Purchasing will manage the BVA process, soliciting at least four Small Business and Supplier Diversity (SBSD) certified firms.<br><br><strong>SBSD Certified Spot Award Potential:</strong> Since your vendor is SBSD certified, the procurement may POSSIBLY qualify for an SBSD Certified Spot Award if the vendor has never received a Spot Award previously and meets other requirements. Procurement Services will determine if this option is available during the procurement process.';
        timeline = 'Timeline: 15-60+ days, depending on the complexity of the purchase and vendor responses. The timeline may be shorter if an SBSD Certified Spot Award can be utilized.';
      } else {
        procurementMethod = 'Request for Quote (RFQ)';
        description = 'For standard items/services in this value range, a Request for Quote process is used with award based on the lowest price.';
        additionalInfo = 'Submit a requisition in RealSource. University Purchasing will manage the RFQ process, soliciting at least four SBSD certified firms.<br><br><strong>SBSD Certified Spot Award Potential:</strong> Since your vendor is SBSD certified, the procurement may POSSIBLY qualify for an SBSD Certified Spot Award if the vendor has never received a Spot Award previously and meets other requirements. Procurement Services will determine if this option is available during the procurement process.';
        timeline = 'Timeline: 5-15+ days, depending on the complexity of the purchase and vendor responses. The timeline may be shorter if an SBSD Certified Spot Award can be utilized.';
      }
    } else if (userSelections.emergency === 'yes') {
      procurementMethod = 'Emergency Procurement';
      description = 'Due to the emergency nature of this purchase, you should follow emergency procurement procedures. This involves direct sourcing with minimal competition requirements.';
      additionalInfo = 'Emergency procurements require detailed justification and approval. Submit a requisition in RealSource with emergency justification explaining the immediate threat to public health, welfare, safety, or property, and why normal procurement methods cannot be used. You must document the genuine emergency nature of the situation.';
      timeline = 'Timeline: Can be expedited to 1-5 business days, depending on the urgency and Purchasing\'s approval process. Note that misuse of emergency procurement procedures for non-emergency situations may result in rejection of your request.';
    } else if (userSelections.singleSource === 'yes') {
      procurementMethod = 'Sole Source Procurement';
      description = 'Since only one vendor can provide this
