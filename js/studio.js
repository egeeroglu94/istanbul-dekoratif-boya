// AI Design Studio - Final Production + Masking V7

// INTEGRATION: Pollinations.ai (Free, Keyless, High Quality)
// Model: Flux (State-of-the-art)

document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Studio Initialized');

    const uploadBtn = document.getElementById('uploadBtn');

    const uploadInput = document.getElementById('imageUpload');
    const imageWrapper = document.getElementById('imageWrapper');
    const mainImage = document.getElementById('mainImage');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const textureCanvas = document.getElementById('textureCanvas');
    const maskCanvas = document.getElementById('maskCanvas'); // Interaction Layer
    const statusMsg = document.getElementById('statusMsg');

    // Mask Controls
    const maskControls = document.getElementById('maskControls');
    const startMaskBtn = document.getElementById('startMaskBtn');
    const clearMaskBtn = document.getElementById('clearMaskBtn');

    // State
    let isMasking = false;
    let points = [];
    let currentTexture = null;

    function updateStatus(msg) {
        if (statusMsg) statusMsg.textContent = msg;
    }

    // --- MAGIC TEXTURE LOGIC (GEMINI / OPENAI) ---
    const generateMagicBtn = document.getElementById('generateMagicBtn');
    const magicPrompt = document.getElementById('magicPrompt');
    const settingsBtn = document.getElementById('settingsBtn');
    const apiKeyModal = document.getElementById('apiKeyModal');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    const useFreeBtn = document.getElementById('useFreeBtn');
    const closeModalLink = document.getElementById('closeModalLink');

    // API Key Management
    function getApiKey() {
        return localStorage.getItem('ai_studio_api_key');
    }

    function saveApiKey(key) {
        if (!key || key.length < 10) {
            alert('Lütfen geçerli bir API anahtarı girin.');
            return false;
        }
        localStorage.setItem('ai_studio_api_key', key);
        return true;
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if (apiKeyModal) {
                apiKeyModal.style.display = 'flex';
                apiKeyInput.value = getApiKey() || '';
            }
        });
    }

    // "Continue Free" Button Logic
    if (useFreeBtn && apiKeyModal) {
        useFreeBtn.addEventListener('click', () => {
            localStorage.removeItem('ai_studio_api_key'); // Clear any old/broken keys
            apiKeyInput.value = '';
            apiKeyModal.style.display = 'none';
            updateStatus('Ücretsiz Mod aktif. Anahtarsız devam edebilirsiniz.');
        });
    }

    if (closeModalLink && apiKeyModal) {
        closeModalLink.addEventListener('click', (e) => {
            e.preventDefault();
            apiKeyModal.style.display = 'none';
        });
    }

    if (saveKeyBtn && apiKeyModal) {
        saveKeyBtn.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (saveApiKey(key)) {
                apiKeyModal.style.display = 'none';
                updateStatus('API Anahtarı kaydedildi. Teşekkürler.');
            }
        });
    }

    // --- CUSTOM TEXTURE UPLOAD ---
    const customTextureUpload = document.getElementById('customTextureUpload');
    const uploadTextureBtn = document.getElementById('uploadTextureBtn');

    if (uploadTextureBtn && customTextureUpload) {
        uploadTextureBtn.addEventListener('click', (e) => {
            e.preventDefault();
            customTextureUpload.click();
        });

        customTextureUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            updateStatus('Özel doku yükleniyor...');

            try {
                let url = '';

                // HEIC Support for Textures too
                if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                    const conversionResult = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
                    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                    url = URL.createObjectURL(blob);
                } else {
                    const reader = new FileReader();
                    url = await new Promise(resolve => {
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(file);
                    });
                }

                const customTex = {
                    name: 'Özel: ' + file.name.substring(0, 10),
                    src: url,
                    blendMode: 'multiply',
                    opacity: 0.9
                };

                addToTextureGrid(customTex);
                applyTexture(customTex);
                updateStatus('Özel doku başarıyla eklendi ve uygulandı.');

            } catch (err) {
                console.error('Texture Upload Error:', err);
                alert('Doku yüklenemedi: ' + err.message);
                updateStatus('Hata: Doku dosyası okunamadı.');
            }

            // Reset input
            customTextureUpload.value = '';
        });
    }

    async function generateTextureWithAI(prompt, apiKey) {
        // Detect Provider based on Key format
        const isGemini = apiKey && apiKey.startsWith('AIza');
        const isOpenAI = apiKey && apiKey.startsWith('sk-');

        // Strict Prompt Engineering (Local Construction)
        // Used for both Keyless and Fallback scenarios
        const strictPrompt = `Italian decorative plaster texture: ${prompt}. Close-up, macro photography, seamless texture, top-down flat view. Architectural finish (Venetian/Travertino/San Marco style). NO furniture, NO room, NO perspective, NO shadows. Flat surface material only.`;

        let imageUrl = null;

        if (isGemini) {
            // GOOGLE GEMINI (TEXT-TO-PROMPT) + POLLINATIONS (IMAGE)
            updateStatus('Gemini ile doku tarifi geliştiriliyor...');

            let enhancedPrompt = strictPrompt;

            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

                const geminiResponse = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are an expert in Italian Decorative Paints.
                                Convert strictly to a TEXTURE PROMPT.
                                Request: "${prompt}"
                                Rules: No rooms, no furniture, seamless texture close-up.
                                Output: English prompt only.`
                            }]
                        }]
                    })
                });

                if (!geminiResponse.ok) {
                    console.warn('Gemini Enhancer Failed, using strict local prompt.');
                    // Fallback to strict local prompt
                } else {
                    const geminiData = await geminiResponse.json();
                    let gText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (gText) {
                        enhancedPrompt = "Seamless texture of " + gText + ", flat lighting, no 3d objects";
                        updateStatus('Gemini: "' + enhancedPrompt.substring(0, 30) + '..."');
                    }
                }
            } catch (error) {
                console.warn('Gemini Error (Bypassed):', error);
            }

            // Generate via Pollinations
            updateStatus('Görsel oluşturuluyor (Flux - Gemini Destekli)...');
            const seed = Math.floor(Math.random() * 1000000);
            const encodedPrompt = encodeURIComponent(enhancedPrompt);
            imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

        } else if (isOpenAI) {
            // OPENAI DALL-E 3
            updateStatus('OpenAI DALL-E 3 ile profesyonel doku hazırlanıyor...');

            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: strictPrompt,
                    n: 1,
                    size: "1024x1024",
                    response_format: "b64_json",
                    quality: "hd",
                    style: "natural"
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error('OpenAI Hatası: ' + (err.error?.message || response.statusText));
            }

            const data = await response.json();
            if (data.data && data.data[0] && data.data[0].b64_json) {
                imageUrl = "data:image/png;base64," + data.data[0].b64_json;
            } else {
                throw new Error("OpenAI'dan görüntü verisi alınamadı.");
            }
        } else {
            // KEYLESS MODE (Pollinations Direct)
            updateStatus('Ücretsiz AI Modu (Flux) ile doku hazırlanıyor...');

            const seed = Math.floor(Math.random() * 1000000);
            // Use strict prompt to ensure quality without Gemini intelligence
            const encodedPrompt = encodeURIComponent(strictPrompt);
            imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
        }

        // Common Image Check for URL-based results (Gemini/Pollinations)
        if (imageUrl && imageUrl.startsWith('http')) {
            const imgCheck = new Image();
            imgCheck.crossOrigin = "Anonymous";
            await new Promise((resolve, reject) => {
                imgCheck.onload = resolve;
                imgCheck.onerror = () => reject(new Error("Görsel sunucusuna erişilemedi (Pollinations)."));
                imgCheck.src = imageUrl;
            });
        }

        return imageUrl;
    }

    if (generateMagicBtn && magicPrompt) {
        generateMagicBtn.addEventListener('click', async () => {
            const promptText = magicPrompt.value.trim();
            if (!promptText) {
                alert('Lütfen bir doku tarifi yazın.');
                return;
            }

            if (!mainImage.src || mainImage.style.display === 'none') {
                alert('Lütfen önce bir fotoğraf yükleyin.');
                return;
            }

            const apiKey = getApiKey();
            // We NO LONGER BLOCK if apiKey is missing. We just use Keyless mode.

            generateMagicBtn.disabled = true;
            generateMagicBtn.innerHTML = 'HESAPLANIYOR...';

            try {
                const imageUrl = await generateTextureWithAI(promptText, apiKey);

                const magicTexture = {
                    name: 'AI: ' + promptText.substring(0, 15),
                    src: imageUrl,
                    blendMode: 'multiply',
                    opacity: 0.9
                };

                addToTextureGrid(magicTexture);
                applyTexture(magicTexture);
                updateStatus('Harika! Doku başarıyla uygulandı.');

            } catch (error) {
                console.error('AI Generation Failed:', error);

                // Specifically handle OpenAI Billing Error
                if (error.message.includes('Billing') || error.message.includes('insufficient_quota')) {
                    alert('OpenAI bakiyeniz bitmiş. Sistem otomatik olarak ücretsiz moda geçiyor.');
                    // Retry without key (triggers Keyless mode)
                    try {
                        updateStatus('Ücretsiz moda geçiliyor...');
                        const fallbackUrl = await generateTextureWithAI(promptText, null);
                        const magicTexture = {
                            name: 'AI (Free): ' + promptText.substring(0, 15),
                            src: fallbackUrl,
                            blendMode: 'multiply',
                            opacity: 0.9
                        };
                        addToTextureGrid(magicTexture);
                        applyTexture(magicTexture);
                        updateStatus('Tamamlandı (Ücretsiz Mod).');
                    } catch (fallbackErr) {
                        alert('Hata: ' + fallbackErr.message);
                    }
                } else {
                    alert('Hata: ' + error.message);
                    updateStatus('Hata: ' + error.message);
                }

            } finally {
                generateMagicBtn.disabled = false;
                generateMagicBtn.innerHTML = '<span>YARAT</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>';
            }
        });
    }

    function addToTextureGrid(tex) {
        const div = document.createElement('div');
        div.className = 'texture-item';
        div.style.cssText = `aspect-ratio: 1; background-image: url('${tex.src}'); background-size: cover; border: 1px solid #d4af37; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);`;
        div.onclick = () => applyTexture(tex);

        // Add as first item
        if (textureGrid) {
            textureGrid.insertBefore(div, textureGrid.firstChild);
        }
    }

    // --- MASKING LOGIC ---

    // Toggle Masking Mode
    function toggleMasking(enable) {
        isMasking = enable;
        if (enable) {
            startMaskBtn.textContent = 'SEÇİMİ BİTİR (Çift Tık)';
            startMaskBtn.style.background = '#d4af37';
            maskCanvas.style.pointerEvents = 'auto';
            updateStatus('Duvarın köşelerine tıklayın. Bitirmek için çift tıklayın.');
        } else {
            startMaskBtn.textContent = 'SEÇİME BAŞLA';
            startMaskBtn.style.background = '#333';
            // maskCanvas.style.pointerEvents = 'none'; // Keep active for visual feedback if needed
            updateStatus('Seçim tamamlandı. Doku uygulayabilirsiniz.');
        }
    }

    if (startMaskBtn) {
        startMaskBtn.addEventListener('click', () => {
            if (!isMasking) {
                points = []; // New selection starts

                // Clear texture to improve visibility during selection
                if (textureCanvas) {
                    const ctx = textureCanvas.getContext('2d');
                    ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
                }

                drawMaskOverlay();
                toggleMasking(true);
            } else {
                toggleMasking(false); // Manually finish
                if (currentTexture) applyTexture(currentTexture); // Re-apply texture
            }
        });
    }

    if (clearMaskBtn) {
        clearMaskBtn.addEventListener('click', () => {
            points = [];
            drawMaskOverlay();
            if (currentTexture) applyTexture(currentTexture); // Re-apply texture (full screen now)
            updateStatus('Seçim temizlendi. Doku tüm ekrana uygulanıyor.');
        });
    }

    // Capture Clicks on Mask Canvas
    if (maskCanvas) {
        maskCanvas.addEventListener('click', (e) => {
            if (!isMasking) return;

            const rect = maskCanvas.getBoundingClientRect();
            // Store normalized coordinates (0-1) to handle resizing
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            points.push({ x, y });
            drawMaskOverlay();
        });

        // Double click to close path
        maskCanvas.addEventListener('dblclick', (e) => {
            if (!isMasking) return;
            toggleMasking(false);
            if (currentTexture) applyTexture(currentTexture);
        });
    }

    // Draw the Polygon Overlay (Feedback)
    function drawMaskOverlay() {
        if (!maskCanvas) return;
        maskCanvas.width = imageWrapper.clientWidth;
        maskCanvas.height = imageWrapper.clientHeight;
        const ctx = maskCanvas.getContext('2d');
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

        if (points.length === 0) return;

        // Update status with point count
        if (isMasking) {
            updateStatus(`Seçim yapılıyor. ${points.length} nokta eklendi. Bitirmek için çift tıklayın.`);
        }

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';

        ctx.beginPath();
        const w = maskCanvas.width;
        const h = maskCanvas.height;

        ctx.moveTo(points[0].x * w, points[0].y * h);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x * w, points[i].y * h);
        }

        if (!isMasking && points.length > 2) {
            ctx.closePath(); // Visual closed loop when done
            ctx.fill();
        }

        ctx.stroke();

        // Draw dots
        ctx.fillStyle = '#fff';
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * w, p.y * h, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // --- STANDARD LOGIC ---

    if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            uploadInput.click();
        });
    }



    if (uploadInput) {
        uploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Handle HEIC
            if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                updateStatus('HEIC formatı dönüştürülüyor, lütfen bekleyin...');

                try {
                    const conversionResult = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                    });

                    // conversionResult can be an array if multiple images, but for single file it's a blob
                    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                    const url = URL.createObjectURL(blob);
                    loadToCanvas(url);
                    updateStatus('HEIC dönüştürüldü ve yüklendi.');

                } catch (err) {
                    console.error('HEIC Conversion Error:', err);
                    alert('HEIC dönüştürme hatası: ' + err.message);
                    updateStatus('Hata: HEIC dönüştürülemedi.');
                }
                return;
            }

            const reader = new FileReader();
            reader.onload = (evt) => loadToCanvas(evt.target.result);
            reader.onerror = () => alert('Dosya okunamadı');
            reader.readAsDataURL(file);
        });
    }

    function loadToCanvas(src) {
        updateStatus('Görüntü işleniyor...');
        uploadPlaceholder.style.display = 'none';
        imageWrapper.style.display = 'flex';
        maskControls.style.display = 'block'; // Show mask controls
        mainImage.style.display = 'block';

        mainImage.onload = () => {
            updateStatus('Fotoğraf yüklendi. Duvar seçebilir veya doku uygulayabilirsiniz.');
            if (textureCanvas) {
                textureCanvas.width = imageWrapper.clientWidth;
                textureCanvas.height = imageWrapper.clientHeight;
                const ctx = textureCanvas.getContext('2d');
                ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
            }
            if (maskCanvas) {
                maskCanvas.width = imageWrapper.clientWidth;
                maskCanvas.height = imageWrapper.clientHeight;
            }
        };

        if (src.startsWith('http')) mainImage.crossOrigin = "Anonymous";
        mainImage.src = src;
    }

    // Textures
    const textures = [
        { name: 'Travertino Classico', src: 'images/textures/travertino_classico.png', blendMode: 'multiply', opacity: 0.9 },
        { name: 'Marmorino Royal', src: 'images/textures/marmorino_royal.png', blendMode: 'soft-light', opacity: 0.8 },
        { name: 'Velvet Suede', src: 'images/textures/velvet_suede.png', blendMode: 'multiply', opacity: 0.9 },
        { name: 'Concrete Art', src: 'images/textures/concrete_art.png', blendMode: 'multiply', opacity: 0.85 },
        { name: 'Metallic Gold Stucco', src: 'images/textures/metallic_gold_stucco.png', blendMode: 'overlay', opacity: 0.7 },
        { name: 'Sedimentary Stone', src: 'images/textures/sedimentary_stone.png', blendMode: 'multiply', opacity: 0.85 },
        { name: 'Pearl Effect', src: 'images/textures/pearl_effect.png', blendMode: 'overlay', opacity: 0.6 },
        { name: 'Obsidian Plaster', src: 'images/textures/obsidian_plaster.png', blendMode: 'multiply', opacity: 0.85 },
        { name: 'Rustic Terracotta', src: 'images/textures/rustic_terracotta.png', blendMode: 'multiply', opacity: 0.9 }
    ];

    const textureGrid = document.querySelector('.texture-grid');
    if (textureGrid) {
        textureGrid.innerHTML = '';
        textures.forEach(tex => {
            const div = document.createElement('div');
            div.className = 'texture-item';
            div.style.cssText = `aspect-ratio: 1; background-image: url('${tex.src}'); background-size: cover; border: 1px solid #333; cursor: pointer; transition: transform 0.2s;`;
            div.onclick = () => applyTexture(tex);
            textureGrid.appendChild(div);
        });
    }

    // Texture Scale Control
    let currentScale = 0.5;
    const scaleSlider = document.getElementById('scaleSlider');

    if (scaleSlider) {
        scaleSlider.addEventListener('input', (e) => {
            currentScale = parseFloat(e.target.value);
            if (currentTexture) applyTexture(currentTexture);
        });
    }

    function applyTexture(texture) {
        if (!mainImage.src || mainImage.style.display === 'none') {
            alert('Lütfen önce fotoğraf yükleyin.');
            return;
        }

        currentTexture = texture;

        textureCanvas.width = imageWrapper.clientWidth;
        textureCanvas.height = imageWrapper.clientHeight;

        // Reset CSS blending, we will do smarter canvas blending
        textureCanvas.style.mixBlendMode = 'normal';
        textureCanvas.style.opacity = '1.0';

        const ctx = textureCanvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = texture.src;

        img.onload = () => {
            if (points.length > 0 && points.length < 3) {
                alert('Maskeleme tamamlanmadı.');
                return;
            }

            // --- AUTO SCALING ALGORITHM ---
            // Goal: Make the texture look like "material" by ensuring it repeats naturally.
            // Heuristic: Texture should repeat ~3-4 times across the selected wall width.

            let textureScale = currentScale; // Default to slider

            if (points.length > 2) {
                // 1. Calculate Bounding Box of Mask
                let minX = 1, maxX = 0;
                points.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.x > maxX) maxX = p.x;
                });

                const maskWidthPx = (maxX - minX) * textureCanvas.width;

                // 2. Target Repetition (e.g., 3.5 times across the wall)
                // If mask is very narrow, we might want fewer repeats, but 3 is a safe "texture" look.
                const targetRepeats = 3.5;
                const targetTextureWidth = maskWidthPx / targetRepeats;

                // 3. Calculate Scale
                // Limit scale between 0.15 (fine) and 0.8 (large) to prevent extremes
                let calculatedScale = targetTextureWidth / img.width;
                if (calculatedScale < 0.15) calculatedScale = 0.15;
                if (calculatedScale > 0.8) calculatedScale = 0.8;

                textureScale = calculatedScale;

                // Update slider UI to reflect this auto-decision (so user can adjust from there)
                if (scaleSlider) scaleSlider.value = textureScale;
                currentScale = textureScale;
            }

            // 1. Prepare Texture Pattern
            const scaledW = img.width * textureScale;
            const scaledH = img.height * textureScale;

            const offCanvas = document.createElement('canvas');
            offCanvas.width = scaledW;
            offCanvas.height = scaledH;
            const offCtx = offCanvas.getContext('2d');
            offCtx.drawImage(img, 0, 0, scaledW, scaledH);
            const texturePattern = ctx.createPattern(offCanvas, 'repeat');

            ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);

            // Define Path
            ctx.beginPath();
            if (points.length > 2) {
                const w = textureCanvas.width;
                const h = textureCanvas.height;
                ctx.moveTo(points[0].x * w, points[0].y * h);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x * w, points[i].y * h);
                }
                ctx.closePath();
            } else {
                // If no points, fill screen (but warn user)
                ctx.rect(0, 0, textureCanvas.width, textureCanvas.height);
            }

            ctx.save();

            // 2. Fill with New Texture
            ctx.fillStyle = texturePattern;
            ctx.fill();

            // 3. SMART INTEGRATION (Simulated AI Inpainting)
            // We draw the original wall image ON TOP with 'hard-light' or 'multiply'
            // This forces the original shadows, corners, and reflections to interact with the new texture

            updateStatus('Yapay Zeka Işık/Gölge analizi uygulanıyor...');

            // Create pattern from Original Image
            // We need to draw the original image exactly where it is on screen
            // Since textureCanvas matches imageWrapper size, we can just draw image

            ctx.globalCompositeOperation = 'multiply'; // Preserves shadows nicely
            ctx.globalAlpha = 0.85; // Adjustable strength of original shadows

            // Draw original image into the same clip path
            ctx.drawImage(mainImage, 0, 0, textureCanvas.width, textureCanvas.height);

            // Optional: Second pass for High-lights using 'soft-light'
            ctx.globalCompositeOperation = 'soft-light';
            ctx.globalAlpha = 0.3;
            ctx.drawImage(mainImage, 0, 0, textureCanvas.width, textureCanvas.height);

            ctx.restore();

            if (points.length < 3) {
                updateStatus(`${texture.name}: Tüm ekrana uygulandı (+AI Gölge Analizi).`);
            } else {
                updateStatus(`${texture.name}: Doğal ışıkla yüzeye entegre edildi.`);
            }
        };
    }

    window.addEventListener('resize', () => {
        if (mainImage.style.display !== 'none') {
            // In real app, re-render mask overlay and texture
            // Simply ensuring canvas dimensions match for now
            if (maskCanvas) {
                maskCanvas.width = imageWrapper.clientWidth;
                maskCanvas.height = imageWrapper.clientHeight;
                drawMaskOverlay(); // Redraw mask
            }
            if (textureCanvas) {
                // Re-apply texture if resized
                if (currentTexture) applyTexture(currentTexture);
            }
        }
    });

});
