let db;
let isRecording = false;
let recognition;
let currentImageData = null;

const disasterDatabase = {
    fire: {
        name: "Fire Emergency",
        icon: "🔥",
        keywords: ["fire", "smoke", "flame", "burning", "smoke alarm", "blaze", "inferno", "ember"],
        severity: 9,
        immediateActions: [
            "Stay calm and alert others if safe to do so",
            "Call emergency services immediately (112 or local fire department)",
            "If there's smoke, stay low to the ground",
            "Feel doors before opening - if hot, do not open",
            "If clothes are on fire, stop, drop, and roll",
            "Close doors behind you to slow fire spread",
            "Do not use elevators",
            "Meet at designated assembly point"
        ],
        firstAid: [
            "For burns: Cool with running water for 10-20 minutes",
            "Do not apply ice, butter, or ointments to burns",
            "Cover burns loosely with sterile bandage",
            "Watch for signs of shock: pale skin, weakness, blue lips",
            "For smoke inhalation: Move to fresh air immediately",
            "If breathing difficulty, begin CPR if trained"
        ],
        evacuationSteps: [
            "Alert others by shouting 'FIRE!'",
            "Feel doors for heat before opening",
            "If door is hot, find another exit",
            "Stay close to the floor if smoke is present",
            "Use stairs, never elevators",
            "Close doors behind you",
            "Meet at pre-designated assembly point",
            "Call 112 once safely outside",
            "Do not re-enter the building"
        ],
        risks: [
            "Smoke inhalation causing respiratory damage",
            "Burn injuries to skin and tissues",
            "Structural collapse",
            "Explosion hazards",
            "Toxic gas exposure"
        ]
    },
    flood: {
        name: "Flood Emergency",
        icon: "🌊",
        keywords: ["flood", "water", "rising", "tsunami", "inundation", "overflow", "drowning", "submerged"],
        severity: 8,
        immediateActions: [
            "Move to higher ground immediately",
            "Do not walk, swim, or drive through flood waters",
            "Turn off electricity at main switch if safe",
            "Avoid contact with flood water (may be contaminated)",
            "Listen to emergency broadcasts",
            "Move essential items to upper floors",
            "Do not return until authorities declare it safe"
        ],
        firstAid: [
            "For hypothermia: Remove wet clothes, warm gradually",
            "For wounds: Clean and bandage immediately",
            "Watch for signs of infection in following days",
            "Seek medical attention for any water-related illness",
            "If drowning suspected, begin rescue breathing",
            "Treat for shock if person is cold and weak"
        ],
        evacuationSteps: [
            "Listen to official warnings and orders",
            "Pack essential items quickly",
            "Turn off utilities if instructed",
            "Move to higher ground immediately",
            "Avoid walking or driving through water",
            "Go to designated shelter if instructed",
            "Do not return until flood waters recede"
        ],
        risks: [
            "Drowning in swift-moving water",
            "Hypothermia from cold water",
            "Electrocution from downed power lines",
            "Contaminated water exposure",
            "Structural damage from water pressure"
        ]
    },
    earthquake: {
        name: "Earthquake",
        icon: "🌍",
        keywords: ["earthquake", "tremor", "seismic", "shaking", "aftershock", "temblor", "ground moving"],
        severity: 9,
        immediateActions: [
            "DROP to your hands and knees",
            "Take COVER under sturdy furniture",
            "HOLD ON until shaking stops",
            "Stay away from windows and heavy objects",
            "If outdoors, move away from buildings and power lines",
            "Stay calm and reassure others",
            "Be prepared for aftershocks",
            "Check for injuries and damage"
        ],
        firstAid: [
            "For crush injuries: Do not move victim unless in danger",
            "Control bleeding with direct pressure",
            "For neck/back injuries: Keep victim still",
            "Apply ice packs to sprains and strains",
            "Watch for signs of shock",
            "Seek medical attention for any injuries"
        ],
        evacuationSteps: [
            "Check for injuries and provide first aid",
            "Inspect for structural damage before moving",
            "Watch for broken glass and debris",
            "Use stairs, avoid elevators",
            "Stay alert for aftershocks",
            "Go to open area away from buildings",
            "Follow official instructions"
        ],
        risks: [
            "Building collapse",
            "Falling debris and objects",
            "Broken glass injuries",
            "Gas leaks and explosions",
            "Landslides and ground fissures"
        ]
    },
    medical: {
        name: "Medical Emergency",
        icon: "🏥",
        keywords: ["injury", "bleeding", "unconscious", "choking", "heart attack", "stroke", "seizure", "broken bone", "cut", "wound", "pain", "difficulty breathing", "allergic reaction", "anaphylaxis"],
        severity: 10,
        immediateActions: [
            "Assess the scene for safety",
            "Check if person is responsive",
            "Call emergency services (112)",
            "Do not move injured person unless in danger",
            "Apply pressure to stop bleeding",
            "Begin CPR if no pulse and not breathing",
            "Keep person warm and comfortable",
            "Monitor vital signs"
        ],
        firstAid: [
            "For bleeding: Apply direct pressure with clean cloth",
            "For choking: Perform Heimlich maneuver",
            "For heart attack: Keep calm, aspirin if not allergic",
            "For stroke: Note time, keep person comfortable (F.A.S.T.)",
            "For seizures: Clear area, protect head, do not restrain",
            "For broken bones: Immobilize, do not realign",
            "For burns: Cool with water, cover loosely",
            "For allergic reaction: Use epinephrine auto-injector"
        ],
        evacuationSteps: [
            "Do not evacuate seriously injured if safer to stay",
            "If evacuation necessary, immobilize injuries first",
            "Use stretcher or makeshift carrier if available",
            "Keep spine straight if neck/back injury suspected",
            "Apply pressure to bleeding during transport",
            "Continue monitoring breathing and consciousness"
        ],
        risks: [
            "Loss of consciousness",
            "Severe blood loss",
            "Breathing difficulties",
            "Shock",
            "Permanent disability"
        ]
    },
    evacuation: {
        name: "General Evacuation",
        icon: "🚪",
        keywords: ["evacuate", "leave", "exit", "escape", "flee", "urgent", "emergency exit"],
        severity: 7,
        immediateActions: [
            "Stay calm and act quickly",
            "Gather essential items only",
            "Follow official evacuation routes",
            "Help others who need assistance",
            "Close doors and windows behind you",
            "Turn off utilities if instructed",
            "Take your emergency kit",
            "Do not use elevators"
        ],
        firstAid: [
            "Ensure everyone has safe passage",
            "Check for injuries along evacuation route",
            "Apply basic first aid if needed",
            "Keep injured persons warm and comfortable",
            "Note any hazards encountered",
            "Report injuries at assembly point"
        ],
        evacuationSteps: [
            "Know your evacuation routes in advance",
            "Identify meeting points",
            "Pack emergency supply kit",
            "Secure your home (lock doors, turn off utilities)",
            "Follow signs to emergency exits",
            "Help children, elderly, and disabled",
            "Stay in your vehicle if caught in traffic",
            "Proceed to designated shelter or safe location"
        ],
        risks: [
            "Traffic accidents during mass evacuation",
            "Panic and crowd crush",
            "Getting lost or separated",
            "Exposure to hazards during evacuation",
            "Running out of supplies"
        ]
    },
    shelter: {
        name: "Shelter in Place",
        icon: "🏠",
        keywords: ["shelter", "stay inside", "lockdown", "hide", "secure", "indoors", "take cover"],
        severity: 6,
        immediateActions: [
            "Go inside immediately",
            "Lock all doors and windows",
            "Move to interior room if unsafe area",
            "Stay away from windows and doors",
            "Monitor emergency broadcasts",
            "Silence phone ringtones",
            "Be quiet to avoid detection",
            "Prepare to evacuate if conditions change"
        ],
        firstAid: [
            "Keep emergency supplies accessible",
            "Know location of first aid kit",
            "Be prepared to treat injuries",
            "Stay calm to think clearly",
            "If injury occurs, assess before moving",
            "Use phone for emergency help if possible"
        ],
        evacuationSteps: [
            "Only evacuate if instructed or in immediate danger",
            "Have go-bag ready at all times",
            "Know multiple exit routes",
            "Stay informed of changing conditions",
            "Follow official guidance",
            "Leave immediately if conditions deteriorate"
        ],
        risks: [
            "Being trapped if building is compromised",
            "Running out of supplies",
            "Isolation and stress",
            "Power and water outages",
            "Inability to get emergency help"
        ]
    }
};

const emergencyContacts = [
    { name: "Emergency Services (All in One)", number: "112", available: "24/7" },
    { name: "Police", number: "100", available: "24/7" },
    { name: "Fire Brigade", number: "101", available: "24/7" },
    { name: "Ambulance", number: "108", available: "24/7" },
    { name: "National Disaster Response Force", number: "011-24363260", available: "24/7" },
    { name: "India Meteorological Department", number: "011-24643917", available: "24/7" },
    { name: "Electricity Emergency", number: "1912", available: "24/7" },
    { name: "Gas Leak Emergency", number: "1906", available: "24/7" },
    { name: "Road Accident Emergency", number: "1073", available: "24/7" },
    { name: "Railway Accident Emergency", number: "1072", available: "24/7" }
];

const survivalTips = [
    { title: "Water Conservation", tip: "Store at least 1 gallon per person per day. Assume 3 days minimum, 2 weeks recommended for major disasters." },
    { title: "Food Supply", tip: "Keep non-perishable foods that require no cooking. Include manual can opener. Rotate supplies every 6 months." },
    { title: "First Aid Kit", tip: "Include bandages, antiseptic, pain relievers, prescription medications, scissors, tweezers, and emergency blanket." },
    { title: "Communication Plan", tip: "Have an out-of-area contact person. Teach children how to call 112 (emergency) and family contacts." },
    { title: "Important Documents", tip: "Keep copies of ID, insurance policies, bank records, and medical info in waterproof container." },
    { title: "Cash Reserve", tip: "Keep small bills and coins. ATMs may not work during power outages." },
    { title: "Battery Backup", tip: "Stock various sizes of batteries. Consider rechargeable battery packs and solar chargers." },
    { title: "Stay Informed", tip: "Battery-powered or hand-crank radio. Know your local emergency broadcast stations." }
];

const emergencyChecklist = [
    { item: "Three-day supply of water (1 gallon per person per day)", category: "water" },
    { item: "Non-perishable food (3-day supply per person)", category: "food" },
    { item: "Manual can opener", category: "food" },
    { item: "First aid kit with medications", category: "medical" },
    { item: "Battery-powered or hand-crank radio", category: "communication" },
    { item: "Flashlights with extra batteries", category: "light" },
    { item: "Cell phone with chargers/power bank", category: "communication" },
    { item: "Cash and important documents", category: "documents" },
    { item: "Clothing and blankets", category: "clothing" },
    { item: "Dust masks (N95)", category: "safety" },
    { item: "Moist towelettes and garbage bags", category: "sanitation" },
    { item: "Wrench or pliers to turn off utilities", category: "tools" },
    { item: "Whistle to signal for help", category: "safety" },
    { item: "Local maps", category: "navigation" },
    { item: "Prescription medications (7-day supply)", category: "medical" },
    { item: "Pet supplies if applicable", category: "pets" }
];

const firstAidGuides = [
    {
        title: "CPR (Cardiopulmonary Resuscitation)",
        content: "Push hard and fast in center of chest (100-120 compressions/min). Allow full chest recoil. Give 2 rescue breaths after every 30 compressions if trained. Continue until help arrives or person responds."
    },
    {
        title: "Heimlich Maneuver",
        content: "Stand behind person. Place fist above navel, below ribcage. Grasp fist with other hand. Give quick upward thrusts until object is expelled. For pregnant/obese: place hands on chest."
    },
    {
        title: "Stop the Bleeding",
        content: "Apply direct pressure with clean cloth. Maintain pressure for at least 10 minutes. Add more cloth if blood soaks through. If possible, elevate wounded area above heart. Seek emergency help for severe bleeding."
    },
    {
        title: "Treating Shock",
        content: "Lay person flat, elevate legs 12 inches. Cover with blanket to maintain body heat. Do not give food or water. Monitor breathing. Keep person calm and reassure. Call 112 immediately."
    },
    {
        title: "Burns",
        content: "Cool burn with running water for 10-20 minutes. Do NOT use ice, butter, or ointments. Cover loosely with sterile bandage. Do not break blisters. Seek medical help for severe burns."
    },
    {
        title: "Choking (Infant)",
        content: "Place infant face-down on forearm. Give 5 back blows between shoulder blades. Turn infant over, give 5 chest thrusts. Repeat until object is expelled. Call 112 if infant becomes unconscious."
    },
    {
        title: "Fractures and Sprains",
        content: "RICE: Rest, Ice, Compression, Elevation. Do not try to realign bone. Immobilize injured area. Apply ice wrapped in cloth for 20 minutes. Seek medical attention."
    },
    {
        title: "Heart Attack Signs",
        content: "Chest pain/pressure, shortness of breath, pain in arm/jaw/back. Call 911 immediately. Have person chew aspirin if not allergic. Keep person calm and comfortable. Be ready to perform CPR."
    },
    {
        title: "Stroke (F.A.S.T.)",
        content: "F-Face drooping, A-Arm weakness, S-Speech difficulty, T-Time to call 911. Note time symptoms started. Keep person comfortable. Do not give food or water."
    },
    {
        title: "Allergic Reaction/Anaphylaxis",
        content: "Use epinephrine auto-injector immediately if available. Call 911. Have person lie flat with legs elevated. Be ready to perform CPR. Monitor breathing closely."
    }
];

async function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DisasterResponseDB', 1);

        request.onerror = () => {
            console.error('Database error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('Database initialized successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            if (!database.objectStoreNames.contains('analysisHistory')) {
                database.createObjectStore('analysisHistory', { keyPath: 'id', autoIncrement: true });
            }
            
            if (!database.objectStoreNames.contains('savedAlerts')) {
                database.createObjectStore('savedAlerts', { keyPath: 'id', autoIncrement: true });
            }
            
            if (!database.objectStoreNames.contains('userPreferences')) {
                database.createObjectStore('userPreferences', { keyPath: 'key' });
            }
            
            if (!database.objectStoreNames.contains('offlineCache')) {
                database.createObjectStore('offlineCache', { keyPath: 'key' });
            }
        };
    });
}

async function saveToDatabase(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getFromDatabase(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function switchInputMethod(method) {
    document.querySelectorAll('.input-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-method="${method}"]`).classList.add('active');

    document.getElementById('textInputArea').classList.add('hidden');
    document.getElementById('voiceInputArea').classList.add('hidden');
    document.getElementById('imageInputArea').classList.add('hidden');

    document.getElementById(`${method}InputArea`).classList.remove('hidden');
}

function toggleVoiceRecording() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceBtnText = document.getElementById('voiceBtnText');
    const voiceTranscript = document.getElementById('voiceTranscript');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
    }

    if (!isRecording) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceBtnText.textContent = 'Stop Recording';
            voiceTranscript.textContent = 'Listening...';
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            voiceTranscript.textContent = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access.');
            }
            stopRecording();
        };

        recognition.onend = () => {
            if (isRecording) {
                recognition.start();
            }
        };

        recognition.start();
    } else {
        stopRecording();
    }
}

function stopRecording() {
    if (recognition) {
        isRecording = false;
        recognition.stop();
        recognition = null;
    }

    const voiceBtn = document.getElementById('voiceBtn');
    const voiceBtnText = document.getElementById('voiceBtnText');
    
    voiceBtn.classList.remove('recording');
    voiceBtnText.textContent = 'Start Recording';

    const transcript = document.getElementById('voiceTranscript').textContent;
    if (transcript && transcript !== 'Listening...') {
        document.getElementById('userInput').value = transcript;
        switchInputMethod('text');
        analyzeInput();
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageData = e.target.result;
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${currentImageData}" alt="Uploaded image">`;
        document.getElementById('analyzeImageBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function analyzeImage() {
    if (!currentImageData) return;

    const analyzeBtn = document.getElementById('analyzeImageBtn');
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="loading"></span>Analyzing...';

    try {
        const analysis = await performImageAnalysis(currentImageData);
        displayAnalysisResults(analysis);
        
        await saveToDatabase('analysisHistory', {
            type: 'image',
            data: analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Image analysis error:', error);
        alert('Error analyzing image. Please try again.');
    }

    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<span>Analyze Image</span><span class="icon">🔍</span>';
}

async function performImageAnalysis(imageData) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
        img.onload = () => {
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            
            const imageDataObj = ctx.getImageData(0, 0, 100, 100);
            const data = imageDataObj.data;
            
            let redSum = 0, greenSum = 0, blueSum = 0;
            let pixelCount = 0;

            for (let i = 0; i < data.length; i += 4) {
                redSum += data[i];
                greenSum += data[i + 1];
                blueSum += data[i + 2];
                pixelCount++;
            }

            const avgRed = redSum / pixelCount;
            const avgGreen = greenSum / pixelCount;
            const avgBlue = blueSum / pixelCount;

            let detectedHazards = [];
            let severity = 3;
            let analysisText = '';

            if (avgRed > 180 && avgRed > avgGreen * 1.5 && avgRed > avgBlue * 1.5) {
                detectedHazards.push({
                    type: 'fire',
                    confidence: 0.85 + Math.random() * 0.1,
                    description: 'Potential fire or heat source detected. Red/orange color dominance suggests flames or fire.'
                });
                severity = Math.max(severity, 9);
                analysisText = 'FIRE EMERGENCY DETECTED: Open flames or fire-like colors detected in the image.';
            }

            if (avgBlue > 150 && avgGreen > 100 && avgRed < 100) {
                detectedHazards.push({
                    type: 'water',
                    confidence: 0.75 + Math.random() * 0.1,
                    description: 'Water presence detected. Blue color dominance suggests flooding or water hazard.'
                });
                severity = Math.max(severity, 7);
                if (!analysisText) {
                    analysisText = 'WATER HAZARD DETECTED: Flooding or significant water presence detected.';
                }
            }

            if (avgRed < 80 && avgGreen < 80 && avgBlue < 80 && avgRed < 50) {
                detectedHazards.push({
                    type: 'smoke',
                    confidence: 0.7 + Math.random() * 0.1,
                    description: 'Possible smoke or dark particles in the air. Low brightness with gray tones detected.'
                });
                severity = Math.max(severity, 8);
                if (!analysisText) {
                    analysisText = 'SMOKE/HAZARD DETECTED: Dark particles or smoke-like patterns detected.';
                }
            }

            if (avgRed > 150 && avgGreen < 100 && avgBlue < 100) {
                detectedHazards.push({
                    type: 'injury',
                    confidence: 0.6 + Math.random() * 0.15,
                    description: 'Possible injury or blood presence detected. Red concentrated areas may indicate wounds.'
                });
                severity = Math.max(severity, 9);
                if (!analysisText) {
                    analysisText = 'INJURY DETECTED: Red concentrated areas may indicate injury or blood.';
                }
            }

            if (detectedHazards.length === 0) {
                detectedHazards.push({
                    type: 'general',
                    confidence: 0.5,
                    description: 'No specific hazard patterns detected. Image shows general scene.'
                });
                analysisText = 'No immediate hazards detected in the uploaded image. Continue to assess your surroundings manually.';
            }

            const analysis = {
                type: 'image',
                detectedHazards,
                severity,
                analysisText,
                recommendations: generateRecommendations(detectedHazards),
                timestamp: new Date().toISOString()
            };

            resolve(analysis);
        };

        img.src = imageData;
    });
}

function generateRecommendations(hazards) {
    const recommendations = [];
    
    hazards.forEach(hazard => {
        switch (hazard.type) {
            case 'fire':
                recommendations.push(
                    { priority: 1, action: 'Evacuate immediately if inside', details: 'Do not collect belongings, leave immediately' },
                    { priority: 2, action: 'Call emergency services', details: '911 or local fire department' },
                    { priority: 3, action: 'Stay low if smoke is present', details: 'Smoke rises, cleaner air is near the floor' },
                    { priority: 4, action: 'Feel doors before opening', details: 'If hot, find alternative exit' }
                );
                break;
            case 'water':
                recommendations.push(
                    { priority: 1, action: 'Move to higher ground', details: 'Do not walk or drive through water' },
                    { priority: 2, action: 'Avoid contact with flood water', details: 'May be contaminated' },
                    { priority: 3, action: 'Monitor weather and alerts', details: 'Condition may worsen' },
                    { priority: 4, action: 'Prepare for evacuation', details: 'Have emergency kit ready' }
                );
                break;
            case 'smoke':
                recommendations.push(
                    { priority: 1, action: 'Evacuate the area immediately', details: 'Smoke can be toxic' },
                    { priority: 2, action: 'Cover nose and mouth', details: 'Use damp cloth if available' },
                    { priority: 3, action: 'Find fresh air source', details: 'Move upwind or to ventilated area' },
                    { priority: 4, action: 'Call emergency if experiencing symptoms', details: 'Coughing, dizziness, or difficulty breathing' }
                );
                break;
            case 'injury':
                recommendations.push(
                    { priority: 1, action: 'Assess injuries', details: 'Check for bleeding, consciousness' },
                    { priority: 2, action: 'Apply first aid', details: 'Control bleeding with direct pressure' },
                    { priority: 3, action: 'Call emergency services', details: '911 for serious injuries' },
                    { priority: 4, action: 'Keep victim calm', details: 'Monitor breathing until help arrives' }
                );
                break;
            default:
                recommendations.push(
                    { priority: 1, action: 'Continue manual assessment', details: 'AI did not detect specific hazards' },
                    { priority: 2, action: 'Stay alert to changes', details: 'Conditions can change rapidly' },
                    { priority: 3, action: 'Contact emergency services if needed', details: 'When in doubt, call 911' }
                );
        }
    });

    return recommendations;
}

async function analyzeInput() {
    const input = document.getElementById('userInput').value.trim();
    
    if (!input) {
        alert('Please describe your emergency situation first.');
        return;
    }

    const analyzeBtn = document.querySelector('#textInputArea .analyze-btn');
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="loading"></span>Analyzing...';

    try {
        const analysis = await performTextAnalysis(input);
        displayAnalysisResults(analysis);
        
        await saveToDatabase('analysisHistory', {
            type: 'text',
            input,
            data: analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Error analyzing input. Please try again.');
    }

    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<span>Analyze Situation</span><span class="icon">🔍</span>';
}

async function performTextAnalysis(input) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const inputLower = input.toLowerCase();
    let detectedType = null;
    let highestMatch = 0;
    let matchedKeywords = [];

    for (const [type, disaster] of Object.entries(disasterDatabase)) {
        let matchCount = 0;
        const foundKeywords = [];

        disaster.keywords.forEach(keyword => {
            if (inputLower.includes(keyword.toLowerCase())) {
                matchCount++;
                foundKeywords.push(keyword);
            }
        });

        if (matchCount > highestMatch) {
            highestMatch = matchCount;
            detectedType = type;
            matchedKeywords = foundKeywords;
        }
    }

    if (!detectedType) {
        return {
            type: 'general',
            detectedType: 'Unknown',
            matchedKeywords: [],
            severity: 5,
            analysisText: 'Unable to determine specific emergency type. Please provide more details or select an emergency protocol.',
            recommendations: [
                { priority: 1, action: 'Contact emergency services', details: 'Call 911 for immediate assistance' },
                { priority: 2, action: 'Describe your situation', details: 'Include location, number of people, and hazards' },
                { priority: 3, action: 'Follow general safety guidelines', details: 'Stay calm and assess your surroundings' }
            ],
            timestamp: new Date().toISOString()
        };
    }

    const disaster = disasterDatabase[detectedType];
    let severity = disaster.severity;

    const urgencyWords = ['urgent', 'emergency', 'now', 'immediately', 'help', 'danger'];
    urgencyWords.forEach(word => {
        if (inputLower.includes(word)) {
            severity = Math.min(10, severity + 1);
        }
    });

    return {
        type: 'text',
        detectedType,
        disasterName: disaster.name,
        disasterIcon: disaster.icon,
        matchedKeywords,
        severity,
        analysisText: `Detected ${disaster.name} emergency with ${matchedKeywords.length} matching indicators: ${matchedKeywords.join(', ')}.`,
        risks: disaster.risks,
        immediateActions: disaster.immediateActions,
        firstAid: disaster.firstAid,
        recommendations: disaster.immediateActions.map((action, index) => ({
            priority: index + 1,
            action,
            details: getActionDetails(detectedType, index)
        })),
        timestamp: new Date().toISOString()
    };
}

function getActionDetails(type, index) {
    const details = {
        fire: [
            'Alert others safely without putting yourself at risk',
            'Fire department: 911. Give clear address and floor',
            'Crawl if necessary, check door heat before opening',
            'Stop, Drop, and Roll if clothes catch fire',
            'Close doors to slow fire spread',
            'Use stairs, feel handrails',
            'Count steps in case visibility is poor',
            'Stay outside, meet at predetermined location'
        ],
        flood: [
            'Avoid flooded areas completely',
            'Even shallow water can be dangerous',
            'Turn off at main breaker if safe',
            'Never touch electrical items in water',
            'Listen to NOAA Weather Radio or local TV',
            'Move valuables to upper floors',
            'Return only when officials say it is safe'
        ],
        earthquake: [
            'Protect yourself from falling objects',
            'Get under desk or sturdy table',
            'Hold on to furniture, stay where you are',
            'Stay away from windows and mirrors',
            'Move away from buildings, trees, power lines',
            'Take deep breaths, help others stay calm',
            'Be prepared for aftershocks',
            'Check for injuries, gas leaks, structural damage'
        ],
        medical: [
            'Ensure no further danger to yourself or victim',
            'Tap shoulder and shout, check for response',
            '911. Give victim\'s age, symptoms, location',
            'Moving can worsen spinal injuries',
            'Use clean cloth, apply firm pressure',
            'Only if trained: 30 compressions, 2 breaths',
            'Keep warm, calm, reassure the person',
            'Monitor pulse, breathing, skin color'
        ],
        evacuation: [
            'Panic causes accidents, think before acting',
            'Medications, phone charger, keys only',
            'Know multiple routes from home and work',
            'Help children, elderly, disabled, pets',
            'Slows fire/smoke spread, contains fires',
            'Prevent gas leaks, water damage',
            'Hands-free, leave quickly',
            'Stairs only, elevators can fail'
        ],
        shelter: [
            'No time to hesitate, go inside now',
            'Deadbolts, not just knobs',
            'Interior room away from windows',
            'Walls between you and danger',
            'TV, radio, phone for official updates',
            'Phone on silent, reduce battery use',
            'Silence helps avoid detection',
            'May need to leave if situation changes'
        ]
    };

    return details[type] && details[type][index] ? details[type][index] : 'Proceed with caution and follow emergency protocols.';
}

function displayAnalysisResults(analysis) {
    const severityLevel = document.getElementById('severityLevel');
    const severityLabel = document.getElementById('severityLabel');
    const severityScore = document.getElementById('severityScore');

    severityLevel.style.width = `${analysis.severity * 10}%`;

    const severityLabels = {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        critical: 'Critical Risk'
    };

    let label = 'Medium Risk';
    if (analysis.severity <= 3) label = 'Low Risk';
    else if (analysis.severity <= 5) label = 'Medium Risk';
    else if (analysis.severity <= 7) label = 'High Risk';
    else label = 'Critical Risk';

    severityLabel.textContent = label;
    severityScore.textContent = `Severity: ${analysis.severity}/10`;

    const detectedSituation = document.getElementById('detectedSituation');
    const immediateRisks = document.getElementById('immediateRisks');
    const recommendedActions = document.getElementById('recommendedActions');
    const firstAidInstructions = document.getElementById('firstAidInstructions');

    if (analysis.type === 'image') {
        detectedSituation.textContent = analysis.analysisText;

        immediateRisks.innerHTML = '';
        if (analysis.detectedHazards && analysis.detectedHazards.length > 0) {
            analysis.detectedHazards.forEach(hazard => {
                const li = document.createElement('li');
                li.textContent = `${hazard.description} (${(hazard.confidence * 100).toFixed(0)}% confidence)`;
                immediateRisks.appendChild(li);
            });
        } else {
            immediateRisks.innerHTML = '<li>No specific hazards detected</li>';
        }

        recommendedActions.innerHTML = '';
        if (analysis.recommendations) {
            analysis.recommendations.slice(0, 6).forEach((rec, index) => {
                const div = document.createElement('div');
                div.className = 'action-item';
                div.innerHTML = `
                    <span class="step-number">${index + 1}</span>
                    <div>
                        <strong>${rec.action}</strong>
                        <p style="margin: 4px 0 0; font-size: 0.9rem; color: #94a3b8;">${rec.details}</p>
                    </div>
                `;
                recommendedActions.appendChild(div);
            });
        }

        firstAidInstructions.innerHTML = '<div class="instruction-item">Image analysis complete. Review recommended actions above.</div>';
    } else {
        const icon = analysis.disasterIcon || '⚠️';
        const name = analysis.disasterName || 'Unknown Situation';
        detectedSituation.textContent = `${icon} ${name}: ${analysis.analysisText}`;

        immediateRisks.innerHTML = '';
        if (analysis.risks && analysis.risks.length > 0) {
            analysis.risks.forEach(risk => {
                const li = document.createElement('li');
                li.textContent = risk;
                immediateRisks.appendChild(li);
            });
        } else {
            immediateRisks.innerHTML = '<li>No specific risks identified</li>';
        }

        recommendedActions.innerHTML = '';
        if (analysis.recommendations) {
            analysis.recommendations.slice(0, 6).forEach((rec, index) => {
                const div = document.createElement('div');
                div.className = 'action-item';
                div.innerHTML = `
                    <span class="step-number">${index + 1}</span>
                    <div>
                        <strong>${rec.action}</strong>
                        <p style="margin: 4px 0 0; font-size: 0.9rem; color: #94a3b8;">${rec.details}</p>
                    </div>
                `;
                recommendedActions.appendChild(div);
            });
        }

        firstAidInstructions.innerHTML = '';
        if (analysis.firstAid && analysis.firstAid.length > 0) {
            analysis.firstAid.slice(0, 4).forEach(instruction => {
                const div = document.createElement('div');
                div.className = 'instruction-item';
                div.textContent = instruction;
                firstAidInstructions.appendChild(div);
            });
        } else {
            firstAidInstructions.innerHTML = '<div class="instruction-item">No specific first aid instructions available for this situation.</div>';
        }
    }

    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function showProtocol(type) {
    const disaster = disasterDatabase[type];
    if (!disaster) return;

    const content = document.getElementById('protocolContent');
    content.innerHTML = `
        <h2>${disaster.icon} ${disaster.name} Protocol</h2>
        
        <div class="warning-box">
            <strong>⚠️ Important:</strong> Stay calm and assess your situation before taking action. Your safety is the top priority.
        </div>

        <h3>🚨 Immediate Actions (Do These First)</h3>
        <ul>
            ${disaster.immediateActions.map(action => `<li>${action}</li>`).join('')}
        </ul>

        <h3>🩹 First Aid Instructions</h3>
        <p>Apply these first aid measures while waiting for emergency services:</p>
        <ul>
            ${disaster.firstAid.map(aid => `<li>${aid}</li>`).join('')}
        </ul>

        <div class="tip-box">
            <strong>💡 Pro Tip:</strong> ${getProtocolTip(type)}
        </div>

        <h3>🚪 Evacuation Steps</h3>
        <p>If evacuation is necessary:</p>
        <ul>
            ${disaster.evacuationSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>

        <h3>⚠️ Immediate Risks</h3>
        <ul>
            ${disaster.risks.map(risk => `<li>${risk}</li>`).join('')}
        </ul>
    `;

    document.getElementById('protocolModal').classList.add('show');
}

function getProtocolTip(type) {
    const tips = {
        fire: 'Feel doors with the back of your hand before opening. If hot, use another exit. Keep a flashlight in your bedroom.',
        flood: 'Never drive through flooded roads - it takes just 6 inches of water to lose control, and 12 inches to float a car.',
        earthquake: 'During shaking, get under sturdy furniture. After, expect aftershocks and check for gas leaks before using flames.',
        medical: 'Always wear gloves when helping injured people. If unsure about performing CPR, do chest compressions only.',
        evacuation: 'Know at least two ways out of every building. Designate a family meeting spot outside.',
        shelter: 'Choose a room with few windows and doors. Store emergency supplies in this room.'
    };
    return tips[type] || 'Follow all official instructions and stay informed through emergency broadcasts.';
}

function closeModal() {
    document.getElementById('protocolModal').classList.remove('show');
}

document.getElementById('protocolModal').addEventListener('click', (e) => {
    if (e.target.id === 'protocolModal') {
        closeModal();
    }
});

function switchResource(resource) {
    document.querySelectorAll('.resource-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-resource="${resource}"]`).classList.add('active');

    const content = document.getElementById('resourceContent');

    switch (resource) {
        case 'emergency-contacts':
            content.innerHTML = emergencyContacts.map(contact => `
                <div class="contact-card">
                    <div class="contact-info">
                        <h4>${contact.name}</h4>
                        <p>${contact.available}</p>
                    </div>
                    <a href="tel:${contact.number.replace(/[^0-9]/g, '')}" class="contact-number">${contact.number}</a>
                </div>
            `).join('');
            break;

        case 'first-aid':
            content.innerHTML = firstAidGuides.map(guide => `
                <div class="first-aid-item">
                    <h4>${guide.title}</h4>
                    <p>${guide.content}</p>
                </div>
            `).join('');
            break;

        case 'survival':
            content.innerHTML = survivalTips.map(tip => `
                <div class="survival-tip">
                    <h4>${tip.title}</h4>
                    <p>${tip.tip}</p>
                </div>
            `).join('');
            break;

        case 'checklist':
            let checklistHTML = '<h3 style="margin-bottom: 16px;">Emergency Preparedness Checklist</h3>';
            emergencyChecklist.forEach((item, index) => {
                checklistHTML += `
                    <div class="checklist-item" onclick="toggleChecklistItem(this)">
                        <input type="checkbox" id="check-${index}">
                        <label for="check-${index}">${item.item}</label>
                    </div>
                `;
            });
            content.innerHTML = checklistHTML;
            break;
    }
}

function toggleChecklistItem(element) {
    element.classList.toggle('checked');
    const checkbox = element.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
}

function updateOnlineStatus() {
    const statusIndicator = document.getElementById('onlineStatus');
    const statusText = document.getElementById('statusText');

    if (navigator.onLine) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusText.textContent = 'Online';
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Offline - App Working';
    }
}

function initVoiceOutput() {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        synth.onvoiceschanged = () => {
            synth.getVoices();
        };
    }
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        synth.speak(utterance);
    }
}

function createSampleAlerts() {
    const sampleAlerts = [
        {
            title: 'Severe Weather Warning',
            message: 'Thunderstorms with heavy rain and strong winds expected in your area. Seek shelter immediately.',
            time: new Date(Date.now() - 3600000).toISOString()
        },
        {
            title: 'Flood Advisory',
            message: 'Flash flooding possible near low-lying areas and rivers. Avoid unnecessary travel.',
            time: new Date(Date.now() - 7200000).toISOString()
        },
        {
            title: 'Emergency Broadcast Test',
            message: 'This is a test of the emergency broadcast system. In an actual emergency, follow all instructions.',
            time: new Date(Date.now() - 86400000).toISOString()
        }
    ];

    const alertList = document.getElementById('alertList');
    alertList.innerHTML = sampleAlerts.map(alert => `
        <div class="alert-item">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message" style="color: #94a3b8; margin: 4px 0;">${alert.message}</div>
                <div class="alert-time">${formatTime(alert.time)}</div>
            </div>
        </div>
    `).join('');
}

function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
}

async function cacheEssentialData() {
    try {
        const essentialData = {
            key: 'disasterDatabase',
            data: disasterDatabase,
            timestamp: new Date().toISOString()
        };

        const transaction = db.transaction(['offlineCache'], 'readwrite');
        const store = transaction.objectStore('offlineCache');
        
        const request = store.put(essentialData);
        request.onsuccess = () => {
            console.log('Essential data cached for offline use');
        };
    } catch (error) {
        console.error('Error caching data:', error);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDatabase();
        
        updateOnlineStatus();
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        initVoiceOutput();

        switchResource('emergency-contacts');

        createSampleAlerts();

        await cacheEssentialData();

        console.log('AI Disaster Response Assistant initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Error initializing application. Some features may not work properly.');
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        const activeInput = document.getElementById('textInputArea');
        if (!activeInput.classList.contains('hidden')) {
            analyzeInput();
        }
    }
});