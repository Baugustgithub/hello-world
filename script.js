document.addEventListener('DOMContentLoaded', function() {
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach(collapsible => {
    const content = collapsible.nextElementSibling;
    if (content && content.classList.contains('collapsible-content')) {
      content.classList.remove('show');
    }
    
    collapsible.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      if (content && content.classList.contains('collapsible-content')) {
        content.classList.toggle('show');
      }
    });
  });

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

  const existingContractInfo = document.getElementById('existingContractInfo');
  const notSureInfo = document.getElementById('notSureInfo');
  const resultDisplay = document.getElementById('resultDisplay');

  let userSelections = {
    purchaseType: '',
    existingContract: '',
    value: '',
    specialized: '',
    singleSource: '',
    emergency: '',
    exception: 'none'
  };

  function updateStepIndicator(activeStep) {
    [indicator1, indicator2, indicator3, indicator4].forEach(indicator => {
      indicator.classList.remove('active');
    });

    if (activeStep === 1) indicator1.classList.add('active');
    else if (activeStep === 2) indicator2.classList.add('active');
    else if (activeStep === 3) indicator3.classList.add('active');
    else if (activeStep === 4) indicator4.classList.add('active');
  }

  function showStep(stepNumber) {
    [step1, step2, step3, step4].forEach(step => {
      step.style.display = 'none';
    });

    let stepToShow;
    let stepNumberForIndicator;

    if (typeof stepNumber === 'string' && stepNumber.startsWith('step')) {
      const stepId = stepNumber;
      stepNumberForIndicator = parseInt(stepId.replace('step', ''));
      stepToShow = document.getElementById(stepId);
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

  function resetForm() {
    userSelections = {
      purchaseType: '',
      existingContract: '',
      value: '',
      specialized: '',
      singleSource: '',
      emergency: '',
      exception: 'none'
    };

    document.getElementById('purchaseType').value = '';
    document.getElementById('exception').value = 'none';

    const radioGroups = ['existingContract', 'value', 'specialized', 'singleSource', 'emergency'];
    radioGroups.forEach(groupName => {
      const radios = document.getElementsByName(groupName);
      for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
      }
    });

    existingContractInfo.style.display = 'none';
    notSureInfo.style.display = 'none';
    document.getElementById('fmdMessage').style.display = 'none';
    step1NextButton.style.display = 'inline-block';
    showStep(1);
  }

  startCancelButton.addEventListener('click', function() {
    resetForm();
  });

  step1NextButton.addEventListener('click', function() {
    const purchaseType = document.getElementById('purchaseType').value;
    if (!purchaseType) {
      alert('Please select a procurement type.');
      return;
    }

    if (purchaseType === 'construction') {
      document.getElementById('fmdMessage').style.display = 'block';
      step1NextButton.style.display = 'none';
      return;
    } else {
      document.getElementById('fmdMessage').style.display = 'none';
      step1NextButton.style.display = 'inline-block';
    }

    userSelections.purchaseType = purchaseType;
    showStep(2);
  });

  step2BackButton.addEventListener('click', function() {
    showStep(1);
  });

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

    userSelections.existingContract = selectedValue;
    showStep(3);
  });

  step3BackButton.addEventListener('click', function() {
    showStep(2);
  });

  function areAllCriteriaSelected() {
    const valueSelected = document.querySelector('input[name="value"]:checked');
    const specializedSelected = document.querySelector('input[name="specialized"]:checked');
    const singleSourceSelected = document.querySelector('input[name="singleSource"]:checked');
    const emergencySelected = document.querySelector('input[name="emergency"]:checked');
    return valueSelected && specializedSelected && singleSourceSelected && emergencySelected;
  }
  step3NextButton.addEventListener('click', function() {
    if (!areAllCriteriaSelected()) {
      alert('Please answer all questions.');
      return;
    }

    userSelections.value = document.querySelector('input[name="value"]:checked').value;
    userSelections.specialized = document.querySelector('input[name="specialized"]:checked').value;
    userSelections.singleSource = document.querySelector('input[name="singleSource"]:checked').value;
    userSelections.emergency = document.querySelector('input[name="emergency"]:checked').value;
    userSelections.exception = document.getElementById('exception').value;

    let procurementMethod = '';
    let description = '';
    let additionalInfo = '';
    let timeline = '';
    let exceptionInfo = '';

    if (userSelections.exception !== 'none') {
      const exceptionElement = document.getElementById('exception');
      const exceptionText = exceptionElement.options[exceptionElement.selectedIndex].text;
      exceptionInfo = `<li><strong>Exception to Competition:</strong> ${exceptionText}</li>`;
    }

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

      <!-- Cooperative contract options removed -->
    `;

    showStep(4);
  });

  step4BackButton.addEventListener('click', function() {
    showStep(3);
  });

  resetButton.addEventListener('click', function() {
    resetForm();
  });

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

  function getPurchaseTypeText(type) {
    switch(type) {
      case 'standardGoods': return 'Standard Goods';
      case 'standardServices': return 'Standard Services';
      case 'standardGoodsServices': return 'Standard Goods and Services';
      case 'construction': return 'Related to construction, renovations, or other facility related purchase';
      default: return 'Not specified';
    }
  }

  function getExistingContractText(value) {
    switch(value) {
      case 'yes': return 'Yes';
      case 'no': return 'No';
      case 'notSure': return 'Not sure';
      default: return 'Not specified';
    }
  }

  const downloadResultButton = document.getElementById('downloadResultButton');
  downloadResultButton.addEventListener('click', function() {
    generatePDF();
  });

  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    const purchaseType = document.getElementById('purchaseType').value;
    const existingContract = document.querySelector('input[name="existingContract"]:checked')?.value || 'Not specified';
    const value = document.querySelector('input[name="value"]:checked')?.value || 'Not specified';
    const specialized = document.querySelector('input[name="specialized"]:checked')?.value || 'Not specified';
    const singleSource = document.querySelector('input[name="singleSource"]:checked')?.value || 'Not specified';
    const emergency = document.querySelector('input[name="emergency"]:checked')?.value || 'Not specified';
    const exception = document.getElementById('exception').value;

    const resultContent = document.getElementById('resultDisplay').innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resultContent;
    const resultText = tempDiv.textContent || tempDiv.innerText || '';

    let exceptionText = 'None';
    if (exception !== 'none') {
      const exceptionElement = document.querySelector(`option[value="${exception}"]`);
      if (exceptionElement) {
        exceptionText = exceptionElement.textContent;
      }
    }

    const vcuBlue = [0, 75, 135];
    const vcuGold = [248, 179, 0];

    try {
      doc.addImage(vcuLogoBase64, 'PNG', 77, 10, 56, 20);
      doc.setFontSize(18);
      doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
      doc.text('Procurement Method Suggestion', 105, 38, { align: 'center' });
    } catch (e) {
      doc.setFontSize(24);
      doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
      doc.text('VCU Procurement', 105, 20, { align: 'center' });
      doc.setFontSize(18);
      doc.text('Method Suggestion', 105, 30, { align: 'center' });
    }

    doc.setDrawColor(vcuGold[0], vcuGold[1], vcuGold[2]);
    doc.setLineWidth(1);
    doc.line(20, 43, 190, 43);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDate}`, 20, 50);

    doc.setFontSize(14);
    doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
    doc.text('Procurement Details', 20, 60);

    const detailsData = [
      ['Purchase Type:', getPurchaseTypeText(purchaseType)],
      ['Existing Contract:', getExistingContractText(existingContract)],
      ['Estimated Value:', getValueRangeText(value)],
      ['Complex/Specialized:', specialized === 'yes' ? 'Yes' : 'No'],
      ['Single Source:', singleSource === 'yes' ? 'Yes' : 'No'],
      ['Emergency:', emergency === 'yes' ? 'Yes' : 'No'],
      ['Exception to Competition:', exceptionText]
    ];
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

    const tableEndY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.setTextColor(vcuBlue[0], vcuBlue[1], vcuBlue[2]);
    doc.text('Suggested Procurement Method', 20, tableEndY);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const resultLines = doc.splitTextToSize(resultText.trim(), 170);
    doc.text(resultLines, 20, tableEndY + 10);

    const disclaimerY = tableEndY + 15 + (resultLines.length * 5);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, disclaimerY - 5, 190, disclaimerY - 5);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('IMPORTANT DISCLAIMER', 20, disclaimerY);

    const disclaimer = 'This tool provides guidance only. Procurement Services has the ultimate authority to determine the appropriate procurement method based on a comprehensive review of your specific requirements and applicable policies.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, 170);
    doc.text(disclaimerLines, 20, disclaimerY + 5);

    const contact = 'For assistance: Submit a requisition in RealSource to initiate the process. If the vendor is not yet registered, submit a vendor request in the system. Contact purchasing@vcu.edu for additional guidance.';
    const contactY = disclaimerY + 15 + (disclaimerLines.length * 4);
    doc.text(contact, 20, contactY);

    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Page ' + i + ' of ' + pageCount, 190, 285, { align: 'right' });
    }

    doc.save('VCU_Procurement_Suggestion.pdf');
  }
});
