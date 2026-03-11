// Generate hash
async function generateHash(type) {
    const input = document.getElementById('inputText').value.trim();
    const result = document.getElementById('hashResult');
    const info = document.getElementById('hashInfo');
    const copyBtn = document.getElementById('copyBtn');

    if (!input) {
        showToast('Masukkan text terlebih dahulu');
        return;
    }

    try {
        let hash = '';
        
        if (type === 'md5') {
            hash = md5(input);
        } else {
            const data = new TextEncoder().encode(input);
            let algorithm = '';
            
            switch(type) {
                case 'sha1':
                    algorithm = 'SHA-1';
                    break;
                case 'sha256':
                    algorithm = 'SHA-256';
                    break;
                case 'sha512':
                    algorithm = 'SHA-512';
                    break;
            }
            
            const buffer = await crypto.subtle.digest(algorithm, data);
            hash = Array.from(new Uint8Array(buffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }

        result.innerHTML = hash;
        result.classList.add('has-result');
        info.innerHTML = `<strong>${type.toUpperCase()} Hash</strong><br>Waktu: ${new Date().toLocaleTimeString()}`;
        info.style.display = 'block';
        copyBtn.style.display = 'inline-block';
        
        showToast('Hash berhasil dibuat');
    } catch (error) {
        showToast('Error: ' + error.message);
        console.error(error);
    }
}

// Copy to clipboard
function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    if (text && text !== 'Hash akan muncul di sini...') {
        navigator.clipboard.writeText(text)
            .then(() => showToast('Hash berhasil disalin'))
            .catch(() => showToast('Gagal menyalin'));
    }
}

// Show notification
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('inputText');
    
    if (input) {
        input.addEventListener('input', function() {
            if (!this.value.trim()) {
                document.getElementById('hashResult').innerHTML = '<span class="placeholder">Hash akan muncul di sini...</span>';
                document.getElementById('hashResult').classList.remove('has-result');
                document.getElementById('hashInfo').style.display = 'none';
                document.getElementById('copyBtn').style.display = 'none';
            }
        });
    }
});
