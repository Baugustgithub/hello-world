document.addEventListener('DOMContentLoaded', function() {
  try {
    const procurementTool = document.getElementById('procurement-tool');
    if (!procurementTool) throw new Error('Element #procurement-tool not found');

    // Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const indicator1 = document.getElementById('stepIndicator1');
    const indicator2 = document.getElementById('stepIndicator2');
    const indicator3 = document.getElementById('stepIndicator3');
    const indicator4 = document.getElementById('stepIndicator4');
    const startCancelButton = document.getElementById('startCancelButton');
    const step1NextButton = document.getElementById('step1NextButton');
    const step2BackButton = document.getElementById('step2BackButton');
    const step2NextButton = document.getElementById('step2NextButton');
    const step3BackButton = document.getElementById('step3BackButton');
    const step3NextButton = document.getElementById('step3NextButton');
    const step4BackButton = document.getElementById('step4BackButton');
    const resetButton = document.getElementById('resetButton');
    const downloadResultButton = document.getElementById('downloadResultButton');
    const resultDisplay = document.getElementById('resultDisplay');

    // Verify all buttons exist
    const buttons = [startCancelButton, step1NextButton, step2BackButton, step2NextButton, step3BackButton, step3NextButton, step4BackButton, resetButton, downloadResultButton];
    buttons.forEach((btn, index) => {
      if (!btn) console.warn(`Button at index ${index} not found`);
    });

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

    function updateStepIndicator(activeStep) {
      [indicator1, indicator2, indicator3, indicator4].forEach(indicator => indicator.classList.remove('active'));
      if (activeStep === 1) indicator1.classList.add('active');
      else if (activeStep === 2) indicator2.classList.add('active');
      else if (activeStep === 3) indicator3.classList.add('active');
      else if (activeStep === 4) indicator4.classList.add('active');
    }

    function showStep(stepNumber) {
      [step1, step2, step3, step4].forEach(step => step.style.display = 'none');
      const stepToShow = stepNumber === 1 ? step1 : stepNumber === 2 ? step2 : stepNumber === 3 ? step3 : step4;
      stepToShow.style.display = 'block';
      updateStepIndicator(stepNumber);
    }

    function resetForm() {
      userSelections = { purchaseType: '', existingContract: '', value: '', specialized: '', singleSource: '', emergency: '', sbsdCertified: '', exception: 'none' };
      document.getElementById('purchaseType').value = '';
      document.getElementById('fmdMessage').style.display = 'none';
      step1NextButton.style.display = 'inline-block';
      showStep(1);
    }

    // Attach event listeners with logging
    startCancelButton.addEventListener('click', () => {
      console.log('Cancel clicked');
      resetForm();
    });

    step1NextButton.addEventListener('click', () => {
      console.log('Step 1 Next clicked');
      const purchaseType = document.getElementById('purchaseType').value;
      if (!purchaseType) {
        alert('Please select a procurement type.');
        return;
      }
      if (purchaseType === 'construction') {
        document.getElementById('fmdMessage').style.display = 'block';
        step1NextButton.style.display = 'none';
        return;
      }
      userSelections.purchaseType = purchaseType;
      showStep(2);
    });

    step2BackButton.addEventListener('click', () => {
      console.log('Step 2 Back clicked');
      showStep(1);
    });

    step2NextButton.addEventListener('click', () => {
      console.log('Step 2 Next clicked');
      showStep(3);
    });

    step3BackButton.addEventListener('click', () => {
      console.log('Step 3 Back clicked');
      showStep(2);
    });

    step3NextButton.addEventListener('click', () => {
      console.log('Step 3 Next clicked');
      resultDisplay.innerHTML = '<p>Result placeholder</p>';
      showStep(4);
    });

    step4BackButton.addEventListener('click', () => {
      console.log('Step 4 Back clicked');
      showStep(3);
    });

    resetButton.addEventListener('click', () => {
      console.log('Reset clicked');
      resetForm();
    });

    downloadResultButton.addEventListener('click', () => {
      console.log('Download clicked');
      if (!window.jspdf) {
        alert('PDF library not loaded.');
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text('Procurement Suggestion', 20, 20);
      doc.save('procurement_suggestion.pdf');
    });

  } catch (error) {
    console.error('Script error:', error.message);
    alert('An error occurred. Check the console for details.');
  }
});
