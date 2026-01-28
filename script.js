document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const swapBtn = document.getElementById('swapBtn');
    const inputMode = document.getElementById('inputMode');
    const outputMode = document.getElementById('outputMode');
    const copyBtn = document.getElementById('copyBtn');
    const inputModeBox = document.getElementById('inputModeBox');
    const outputModeBox = document.getElementById('outputModeBox');
    const charCount = document.getElementById('charCount');
    const resultInfo = document.getElementById('resultInfo');
    
    const emptyModal = document.getElementById('emptyModal');
    const modalOk = document.querySelector('.modal-ok');
    
    let isRomanToText = true;
    
    const romanMap = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };
    
    const validRomanChars = /^[IVXLCDM\s,]*$/i;
    
    const validTextChars = /^[A-Z\s]*$/i;
    
    const updateCharCount = () => {
        const count = inputText.value.length;
        charCount.textContent = `${count} karakter`;
    };
    
    const updateModeBoxes = () => {
        if (isRomanToText) {
            inputModeBox.classList.add('active');
            outputModeBox.classList.remove('active');
        } else {
            inputModeBox.classList.remove('active');
            outputModeBox.classList.add('active');
        }
    };
    
    const showModal = () => {
        emptyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const hideModal = () => {
        emptyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    const numberToLetter = (num) => {
        if (num >= 1 && num <= 26) {
            return String.fromCharCode(64 + num);
        }
        return '?';
    };
    
    const letterToNumber = (letter) => {
        if (letter === ' ') return 0;
        const charCode = letter.toUpperCase().charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
            return charCode - 64;
        }
        return 0;
    };
    
    const romanToNumber = (roman) => {
        let result = 0;
        let prevValue = 0;
        
        for (let i = roman.length - 1; i >= 0; i--) {
            const currentChar = roman[i].toUpperCase();
            const currentValue = romanMap[currentChar] || 0;
            
            if (currentValue < prevValue) {
                result -= currentValue;
            } else {
                result += currentValue;
            }
            
            prevValue = currentValue;
        }
        
        return result;
    };
    
    const numberToRoman = (num) => {
        if (num < 1 || num > 39) return '?';
        
        const romanNumerals = [
            { value: 10, numeral: 'X' },
            { value: 9, numeral: 'IX' },
            { value: 5, numeral: 'V' },
            { value: 4, numeral: 'IV' },
            { value: 1, numeral: 'I' }
        ];
        
        let result = '';
        let remaining = num;
        
        for (const { value, numeral } of romanNumerals) {
            while (remaining >= value) {
                result += numeral;
                remaining -= value;
            }
        }
        
        return result;
    };
    
    const isValidRomanInput = (input) => {
        if (!input.trim()) return false;
        
        if (!validRomanChars.test(input)) return false;
        
        const parts = input.split(' ');
        for (const part of parts) {
            if (part.trim() === '') continue;
            const letters = part.split(',');
            for (const letter of letters) {
                const roman = letter.trim().toUpperCase();
                if (roman === '') continue;
                
                for (const char of roman) {
                    if (!romanMap[char]) return false;
                }
            }
        }
        
        return true;
    };
    
    const isValidTextInput = (input) => {
        if (!input.trim()) return false;
        
        if (!validTextChars.test(input)) return false;
        
        const lettersOnly = input.replace(/\s/g, '');
        return /^[A-Z]+$/i.test(lettersOnly);
    };
    
    const translateRomanToText = (input) => {
        let result = '';
        
        let normalizedInput = input.replace(/,\s+/g, ',');
        const words = normalizedInput.split(' ');
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word === '') {
                result += ' ';
                continue;
            }
            
            const letters = word.split(',');
            let wordResult = '';
            
            for (let j = 0; j < letters.length; j++) {
                const roman = letters[j].trim().toUpperCase();
                if (!roman) continue;
                
                const number = romanToNumber(roman);
                const letter = numberToLetter(number);
                wordResult += letter;
            }
            
            result += wordResult;
            if (i < words.length - 1) {
                result += ' ';
            }
        }
        
        return result;
    };
    
    const translateTextToRoman = (input) => {
        let result = '';
        
        const text = input.toUpperCase();
        const words = text.split(' ');
        
        for (let w = 0; w < words.length; w++) {
            const word = words[w];
            if (word === '') {
                result += ' ';
                continue;
            }
            
            let wordInRoman = '';
            
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                const number = letterToNumber(char);
                const roman = numberToRoman(number);
                
                wordInRoman += roman;
                if (i < word.length - 1) {
                    wordInRoman += ',';
                }
            }
            
            result += wordInRoman;
            if (w < words.length - 1) {
                result += ' ';
            }
        }
        
        return result;
    };
    
    const updateResultInfo = (isError) => {
        if (isError) {
            resultInfo.textContent = 'Input tidak valid untuk mode ini';
            resultInfo.style.color = '#ef4444';
        } else if (inputText.value.trim()) {
            resultInfo.textContent = 'Terjemahan berhasil';
            resultInfo.style.color = '#10b981';
        } else {
            resultInfo.textContent = '';
        }
    };
    
    const updateTranslation = () => {
        const input = inputText.value;
        
        if (!input.trim()) {
            outputText.textContent = 'Hasil muncul disini';
            outputText.className = 'output-text';
            updateResultInfo(false);
            return;
        }
        
        let result;
        let isValid = true;
        
        if (isRomanToText) {
            if (isValidRomanInput(input)) {
                result = translateRomanToText(input);
            } else {
                result = 'ERROR: Input harus berupa angka Romawi (I, V, X, L, C, D, M)';
                isValid = false;
            }
        } else {
            if (isValidTextInput(input)) {
                result = translateTextToRoman(input);
            } else {
                result = 'ERROR: Input harus berupa huruf A-Z saja';
                isValid = false;
            }
        }
        
        outputText.textContent = result;
        if (!isValid) {
            outputText.className = 'output-text error';
            updateResultInfo(true);
        } else {
            outputText.className = 'output-text';
            outputText.style.color = '#f8fafc';
            updateResultInfo(false);
        }
    };
    
    swapBtn.addEventListener('click', function() {
        const currentInput = inputText.value.trim();
        const currentOutput = outputText.textContent;
        
        if (currentOutput !== 'Hasil muncul disini' && !currentOutput.startsWith('ERROR:')) {
            inputText.value = currentOutput;
        } else {
            inputText.value = '';
        }
        
        isRomanToText = !isRomanToText;
        
        if (isRomanToText) {
            inputMode.textContent = 'Romawi';
            outputMode.textContent = 'Huruf';
        } else {
            inputMode.textContent = 'Huruf';
            outputMode.textContent = 'Romawi';
        }
        
        updateModeBoxes();
        
        updateTranslation();
        updateCharCount();
        
        inputText.focus();
    });
    
    copyBtn.addEventListener('click', function() {
        const textToCopy = outputText.textContent;
        
        if (!textToCopy || textToCopy === 'Hasil muncul disini' || textToCopy.startsWith('ERROR:')) {
            showModal();
            return;
        }
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Gagal menyalin teks: ', err);
                showModal();
            });
    });
    
    modalOk.addEventListener('click', hideModal);
    
    emptyModal.addEventListener('click', function(e) {
        if (e.target === emptyModal) {
            hideModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emptyModal.classList.contains('active')) {
            hideModal();
        }
    });
    
    inputText.addEventListener('input', function() {
        updateTranslation();
        updateCharCount();
    });
    
    updateCharCount();
    
    updateModeBoxes();
    
    inputText.focus();
});