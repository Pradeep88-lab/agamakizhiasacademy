export interface QuizQuestion {
  id: number;
  textEn: string;
  textTa: string;
  optionsEn: string[];
  optionsTa: string[];
  correctAnswer: number;
  explanationEn: string;
  explanationTa: string;
  subject?: string;
}

export interface MockQuizItem {
  id: number | string;
  title: string;
  duration: string;
  durationSeconds: number;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'High';
  category: string;
  questionsList?: QuizQuestion[];
}

export const coreQuestionBank: QuizQuestion[] = [
  {
    id: 1,
    subject: 'Polity',
    textEn: 'Which Article of the Indian Constitution empowers the High Courts to issue writs for the enforcement of Fundamental Rights?',
    textTa: 'அடிப்படை உரிமைகளை அமல்படுத்துவதற்காக நீதிப்பேராணைகளை (Writs) வெளியிட உயர்நீதிமன்றங்களுக்கு அதிகாரம் அளிக்கும் இந்திய அரசியலமைப்பு விதி எது?',
    optionsEn: ['Article 32', 'Article 226', 'Article 136', 'Article 214'],
    optionsTa: ['விதி 32', 'விதி 226', 'விதி 136', 'விதி 214'],
    correctAnswer: 1,
    explanationEn: 'Article 226 empowers the High Courts to issue writs not only for Fundamental Rights but also for any other legal right. Article 32 gives writ power to the Supreme Court.',
    explanationTa: 'விதி 226 உயர் நீதிமன்றங்களுக்கு அடிப்படை உரிமைகள் மற்றும் பிற சட்ட உரிமைகளுக்காகவும் நீதிப்பேராணைகளை வெளியிட அதிகாரம் அளிக்கிறது. விதி 32 உச்ச நீதிமன்றத்திற்கு அதிகாரம் அளிக்கிறது.'
  },
  {
    id: 2,
    subject: 'History',
    textEn: 'Who was the first female freedom fighter to lead an armed revolt against the British East India Company in India?',
    textTa: 'இந்தியாவில் ஆங்கிலேய கிழக்கிந்திய கம்பெனிக்கு எதிராக ஆயுதமேந்தி போராடிய முதல் பெண் விடுதலைப் போராட்ட வீராங்கனை யார்?',
    optionsEn: ['Rani Lakshmibai', 'Velu Nachiyar', 'Kittur Chennamma', 'Begum Hazrat Mahal'],
    optionsTa: ['ராணி லட்சுமிபாய்', 'வேலு நாச்சியார் (சிவகங்கை)', 'கிட்டூர் சென்னம்மா', 'பேகம் ஹஸ்ரத் மஹால்'],
    correctAnswer: 1,
    explanationEn: 'Rani Velu Nachiyar of Sivaganga (1730–1796) was the first Indian queen to wage war with the East India Company in 1780 and successfully reclaim her kingdom.',
    explanationTa: 'சிவகங்கையின் வீரமங்கை வேலு நாச்சியார் 1780-ல் ஆங்கிலேய கிழக்கிந்திய கம்பெனியை எதிர்த்து போரிட்டு தனது ஆட்சியை மீட்டெடுத்த முதல் இந்திய அரசி ஆவார்.'
  },
  {
    id: 3,
    subject: 'Physics',
    textEn: 'According to Newton’s First Law of Motion, what is the property of an object to resist changes in its state of rest or motion called?',
    textTa: 'நியூட்டனின் முதல் இயக்க விதியின்படி, ஒரு பொருளின் ஓய்வு அல்லது இயக்க நிலையை மாற்ற முயலும் போது எதிர்க்கும் பண்பு எது?',
    optionsEn: ['Momentum', 'Inertia', 'Acceleration', 'Friction'],
    optionsTa: ['உந்தம் (Momentum)', 'நிலைமம் (Inertia)', 'முடுக்கம் (Acceleration)', 'உராய்வு (Friction)'],
    correctAnswer: 1,
    explanationEn: 'Inertia is the natural tendency of objects in motion to stay in motion and objects at rest to stay at rest unless acted on by an external net force.',
    explanationTa: 'புறவிசை செயல்படாதவரை ஒரு பொருள் தனது ஓய்வு அல்லது சீரான இயக்க நிலையிலேயே தொடர்ந்திருக்கும் பண்பு நிலைமம் எனப்படும்.'
  },
  {
    id: 4,
    subject: 'Geography',
    textEn: 'Which is the highest peak in the Western Ghats as well as in South India?',
    textTa: 'மேற்குத் தொடர்ச்சி மலை மற்றும் தென்னிந்தியாவின் மிக உயரமான சிகரம் எது?',
    optionsEn: ['Doddabetta', 'Anamudi', 'Agasthyamalai', 'Mullayanagiri'],
    optionsTa: ['தொட்டபெட்டா', 'ஆனைமுடி (Anamudi)', 'அகத்தியர் மலை', 'முல்லையனகிரி'],
    correctAnswer: 1,
    explanationEn: 'Anamudi in Kerala (2,695 metres / 8,842 ft) is the highest peak in the Western Ghats and all of South India. Doddabetta is the highest peak in the Nilgiris (2,637 m).',
    explanationTa: 'கேரளாவின் ஆனைமுடி சிகரம் (2,695 மீ) மேற்குத் தொடர்ச்சி மலை மற்றும் ஒட்டுமொத்த தென்னிந்தியாவின் மிக உயரமான சிகரமாகும். தொட்டபெட்டா நீலகிரியின் மிக உயரமான சிகரமாகும் (2,637 மீ).'
  },
  {
    id: 5,
    subject: 'Polity',
    textEn: 'Which Constitutional Amendment Act reduced the voting age in India from 21 years to 18 years?',
    textTa: 'இந்தியாவில் வாக்களிக்கும் வயதை 21-லிருந்து 18 ஆகக் குறைத்த அரசியலமைப்பு திருத்தச் சட்டம் எது?',
    optionsEn: ['42nd Amendment, 1976', '44th Amendment, 1978', '61st Amendment, 1988', '73rd Amendment, 1992'],
    optionsTa: ['42வது திருத்தச் சட்டம், 1976', '44வது திருத்தச் சட்டம், 1978', '61வது திருத்தச் சட்டம், 1988', '73வது திருத்தச் சட்டம், 1992'],
    correctAnswer: 2,
    explanationEn: 'The 61st Constitutional Amendment Act, 1988 amended Article 326 of the Constitution to reduce the voting age from 21 to 18 years.',
    explanationTa: '1988-ஆம் ஆண்டின் 61-வது அரசியலமைப்பு திருத்தச் சட்டம், பிரிவு 326-ஐத் திருத்தி வாக்களிக்கும் வயதை 21-லிருந்து 18 ஆகக் குறைத்தது.'
  },
  {
    id: 6,
    subject: 'Science',
    textEn: 'What is the SI unit of electric potential difference and electromotive force?',
    textTa: 'மின்னழுத்த வேறுபாடு மற்றும் மின்னியக்கு விசையின் SI அலகு எது?',
    optionsEn: ['Ampere', 'Ohm', 'Volt', 'Coulomb'],
    optionsTa: ['ஆம்பியர் (Ampere)', 'ஓம் (Ohm)', 'வோல்ட் (Volt)', 'கூலும் (Coulomb)'],
    correctAnswer: 2,
    explanationEn: 'The SI unit of electric potential, potential difference and electromotive force is the Volt (V), named after Alessandro Volta.',
    explanationTa: 'மின்னழுத்தம், மின்னழுத்த வேறுபாடு மற்றும் மின்னியக்கு விசையின் SI அலகு வோல்ட் (Volt) ஆகும்.'
  },
  {
    id: 7,
    subject: 'History',
    textEn: 'The historic "Vaikom Satyagraha" (1924–1925) for temple entry rights was actively led by which Tamil leader?',
    textTa: 'கோயில் தெருக்களில் நுழையும் உரிமைக்காக நடைபெற்ற வரலாற்று சிறப்புமிக்க "வைக்கம் சத்யாகிரகத்தை" (1924-1925) வழிநடத்திய தமிழகத் தலைவர் யார்?',
    optionsEn: ['C. Rajagopalachari', 'Periyar E. V. Ramasamy', 'K. Kamaraj', 'Thiru. Vi. Ka'],
    optionsTa: ['சி. ராஜகோபாலாச்சாரி', 'தந்தை பெரியார் ஈ.வே.ரா', 'கே. காமராஜர்', 'திரு. வி. கலியாணசுந்தரனார்'],
    correctAnswer: 1,
    explanationEn: 'Periyar E. V. Ramasamy led the historic Vaikom Satyagraha in Kerala after initial leaders were arrested, earning him the honorific "Vaikom Veerar".',
    explanationTa: 'கேரளாவில் வைக்கம் சத்தியாகிரகத்தின் தொடக்க தலைவர்கள் கைது செய்யப்பட்ட பின் பெரியார் போராட்டத்தை முன்னின்று வழிநடத்தி வெற்றி பெற்றதால் "வைக்கம் வீரர்" எனப் போற்றப்பட்டார்.'
  },
  {
    id: 8,
    subject: 'Economy',
    textEn: 'Which institution replaced the Planning Commission of India on 1st January 2015?',
    textTa: 'ஜனவரி 1, 2015 அன்று இந்தியாவின் திட்டக் குழுவிற்கு (Planning Commission) பதிலாக உருவாக்கப்பட்ட அமைப்பு எது?',
    optionsEn: ['Finance Commission', 'NITI Aayog', 'National Development Council', 'Central Statistical Office'],
    optionsTa: ['நிதி ஆணையம்', 'நிதி ஆயோக் (NITI Aayog)', 'தேசிய வளர்ச்சிக் குழு', 'மத்திய புள்ளியியல் அலுவலகம்'],
    correctAnswer: 1,
    explanationEn: 'NITI Aayog (National Institution for Transforming India) was formed via a Union Cabinet resolution on 1 January 2015, replacing the 65-year-old Planning Commission.',
    explanationTa: '65 ஆண்டுகள் பழமையான திட்டக்குழுவிற்கு மாற்றாக 1 ஜனவரி 2015-ல் NITI ஆயோக் (தேசிய இந்திய மாற்றுக் குழு) மத்திய அமைச்சரவை தீர்மானத்தின் மூலம் அமைக்கப்பட்டது.'
  },
  {
    id: 9,
    subject: 'Physics',
    textEn: 'Which law of planetary motion states that the orbit of every planet is an ellipse with the Sun at one of the two foci?',
    textTa: 'ஒவ்வொரு கோளும் சூரியனை ஒரு குவியமாகக் கொண்டு நீள்வட்டப் பாதையில் சுற்றுகின்றன என்று கூறும் கோள் இயக்க விதி எது?',
    optionsEn: ["Kepler's First Law", "Kepler's Second Law", "Kepler's Third Law", "Newton's Law of Gravitation"],
    optionsTa: ['கெப்ளரின் முதல் விதி (நீள்வட்டங்களின் விதி)', 'கெப்ளரின் இரண்டாம் விதி (பரப்புகளின் விதி)', 'கெப்ளரின் மூன்றாம் விதி (சுற்றுக்காலங்களின் விதி)', 'நியூட்டனின் ஈர்ப்பு விதி'],
    correctAnswer: 0,
    explanationEn: "Kepler's First Law (Law of Orbits) states that all planets move about the Sun in elliptical orbits, having the Sun as one of the foci.",
    explanationTa: 'கெப்ளரின் முதல் விதி (சுற்றுப்பாதைகளின் விதி): கோள்கள் அனைத்தும் சூரியனை ஒரு குவியத்தில் கொண்ட நீள்வட்டப் பாதையில் சுற்றி வருகின்றன.'
  },
  {
    id: 10,
    subject: 'Polity',
    textEn: 'Under which Article of the Indian Constitution is the Comptroller and Auditor General (CAG) appointed?',
    textTa: 'இந்திய அரசியலமைப்பின் எந்த விதியின் கீழ் இந்திய தலைமை கணக்குத் தணிக்கையாளர் (CAG) நியமிக்கப்படுகிறார்?',
    optionsEn: ['Article 76', 'Article 124', 'Article 148', 'Article 280'],
    optionsTa: ['விதி 76 (அட்டர்னி ஜெனரல்)', 'விதி 124 (உச்ச நீதிமன்றம்)', 'விதி 148 (CAG)', 'விதி 280 (நிதி ஆணையம்)'],
    correctAnswer: 2,
    explanationEn: 'Article 148 of the Constitution of India provides for an independent office of the Comptroller and Auditor General of India, appointed by the President.',
    explanationTa: 'இந்திய அரசியலமைப்பின் 148-வது விதி குடியரசுத் தலைவரால் நியமிக்கப்படும் தலைமை கணக்குத் தணிக்கையாளர் (CAG) பற்றி கூறுகிறது.'
  },
  {
    id: 11,
    subject: 'Science',
    textEn: 'Which optical phenomenon is primarily responsible for the sparkling of diamonds and the transmission of light in optical fibers?',
    textTa: 'வைரங்கள் மின்னுவதற்கும், ஆப்டிகல் ஃபைபர் மூலம் ஒளி சமிக்ஞைகள் கடத்தப்படுவதற்கும் அடிப்படையான ஒளியியல் நிகழ்வு எது?',
    optionsEn: ['Diffraction of light', 'Total Internal Reflection', 'Interference of light', 'Polarization of light'],
    optionsTa: ['ஒளி விளிம்பு விளைவு', 'முழு அக எதிரொளிப்பு (Total Internal Reflection)', 'ஒளி குறுக்கீட்டு விளைவு', 'ஒளித் தளவிளைவு'],
    correctAnswer: 1,
    explanationEn: 'Total Internal Reflection occurs when a ray of light travelling from a denser to a rarer medium strikes the boundary at an angle greater than the critical angle.',
    explanationTa: 'அடர்வு மிகு ஊடகத்திலிருந்து அடர்வு குறை ஊடகத்திற்குச் செல்லும் ஒளிக்கதிர் மாறுநிலைக்கோணத்தை விட அதிக படுகோணத்தில் படும் போது முழு அக எதிரொளிப்பு ஏற்படுகிறது.'
  },
  {
    id: 12,
    subject: 'History',
    textEn: 'In which year did the famous Battle of Plassey take place, establishing the British East India Company’s dominance in Bengal?',
    textTa: 'வங்காளத்தில் கிழக்கிந்திய கம்பெனியின் ஆதிக்கத்தை நிலைநாட்டிய புகழ்பெற்ற பிளாசி போர் (Battle of Plassey) எந்த ஆண்டு நடைபெற்றது?',
    optionsEn: ['1757', '1764', '1773', '1857'],
    optionsTa: ['1757', '1764 (பக்சார் போர்)', '1773 (ஒழுங்குமுறைச் சட்டம்)', '1857 (பெரும் புரட்சி)'],
    correctAnswer: 0,
    explanationEn: 'The Battle of Plassey was fought on 23 June 1757, where British forces under Robert Clive defeated Siraj-ud-Daulah, the Nawab of Bengal.',
    explanationTa: 'ராபர்ட் கிளைவ் தலைமையிலான ஆங்கிலேயப் படை மற்றும் வங்காள நவாப் சிராஜ்-உத்-தௌலா இடையே 23 ஜூன் 1757 அன்று பிளாசி போர் நடைபெற்றது.'
  },
  {
    id: 13,
    subject: 'Environment',
    textEn: 'Which Indian National Park is the world’s last natural habitat of the endangered One-horned Rhinoceros?',
    textTa: 'அழிந்து வரும் அரிய வகை ஒற்றைக் கொம்பு காண்டாமிருகங்களின் உலகளாவிய இயற்கை வாழ்விடமாக விளங்கும் இந்திய தேசிய பூங்கா எது?',
    optionsEn: ['Jim Corbett National Park', 'Kaziranga National Park', 'Gir National Park', 'Sundarbans National Park'],
    optionsTa: ['ஜிம் கார்பெட் தேசிய பூங்கா', 'காசிரங்கா தேசிய பூங்கா (அசாம்)', 'கிர் தேசிய பூங்கா (குஜராத்)', 'சுந்தரவன தேசிய பூங்கா'],
    correctAnswer: 1,
    explanationEn: 'Kaziranga National Park in Assam holds the world’s largest population of the Great Indian One-horned Rhinoceros.',
    explanationTa: 'அசாம் மாநிலத்தில் உள்ள காசிரங்கா தேசிய பூங்காவில் உலகிலேயே அதிக எண்ணிக்கையிலான ஒற்றைக் கொம்பு காண்டாமிருகங்கள் பாதுகாக்கப்படுகின்றன.'
  },
  {
    id: 14,
    subject: 'Polity',
    textEn: 'Who is regarded as the Guardian of the Fundamental Rights in India?',
    textTa: 'இந்தியாவில் அடிப்படை உரிமைகளின் பாதுகாவலன் (Guardian of Fundamental Rights) என்று அழைக்கப்படுவது எது?',
    optionsEn: ['The Parliament', 'The President', 'The Supreme Court and Judiciary', 'The Prime Minister'],
    optionsTa: ['இந்திய நாடாளுமன்றம்', 'குடியரசுத் தலைவர்', 'உச்சநீதிமன்றம் மற்றும் நீதித்துறை', 'இந்தியப் பிரதமர்'],
    correctAnswer: 2,
    explanationEn: 'The Supreme Court is designated as the guarantor and protector of Fundamental Rights under Article 32 of the Constitution.',
    explanationTa: 'அரசியலமைப்பு விதி 32-ன் படி, இந்தியக் குடிமக்களின் அடிப்படை உரிமைகளின் உத்தரவாததாரராகவும் பாதுகாவலனாகவும் உச்ச நீதிமன்றம் விளங்குகிறது.'
  },
  {
    id: 15,
    subject: 'Geography',
    textEn: 'Through how many Indian states does the Tropic of Cancer (23° 30′ N) pass?',
    textTa: 'கடகரேகை (Tropic of Cancer - 23° 30′ வ) எத்தனை இந்திய மாநிலங்கள் வழியாகச் செல்கிறது?',
    optionsEn: ['6 States', '7 States', '8 States', '9 States'],
    optionsTa: ['6 மாநிலங்கள்', '7 மாநிலங்கள்', '8 மாநிலங்கள்', '9 மாநிலங்கள்'],
    correctAnswer: 2,
    explanationEn: 'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.',
    explanationTa: 'கடகரேகை குஜராத், ராஜஸ்தான், மத்தியப் பிரதேசம், சத்தீஸ்கர், ஜார்க்கண்ட், மேற்கு வங்காளம், திரிபுரா மற்றும் மிசோரம் ஆகிய 8 மாநிலங்கள் வழியாகச் செல்கிறது.'
  },
  {
    id: 16,
    subject: 'Physics',
    textEn: 'What is the value of Acceleration due to Gravity (g) at the center of the Earth?',
    textTa: 'பூமியின் மையத்தில் புவியீர்ப்பு முடுக்கத்தின் (g) மதிப்பு என்னவாக இருக்கும்?',
    optionsEn: ['9.8 m/s²', '9.83 m/s²', '0 m/s²', 'Infinite'],
    optionsTa: ['9.8 மீ/விநாடி²', '9.83 மீ/விநாடி²', '0 மீ/விநாடி² (பூஜ்ஜியம்)', 'முடிவிலி (Infinite)'],
    correctAnswer: 2,
    explanationEn: 'At the center of the Earth, the gravitational pull from the mass of the Earth in all directions cancels out, resulting in g = 0 m/s².',
    explanationTa: 'பூமியின் மையத்தில் அனைத்து திசைகளிலிருந்தும் புவியின் நிறை இழுக்கும் ஈர்ப்பு விசை சமன் அடைவதால் ஈர்ப்பு முடுக்கம் g = 0 ஆகும்.'
  },
  {
    id: 17,
    subject: 'Tamil Culture',
    textEn: 'Which ancient Sangam Tamil literature deals exclusively with the themes of love, ethics, and romantic conduct (Agam)?',
    textTa: 'சங்க இலக்கியத்தில் அகப்பொருள் (அன்பு, காதல், குடும்ப ஒழுக்கம்) ஒழுக்கங்களை மட்டுமே முதன்மையாகக் கொண்டு பாடப்பட்ட நூல் தொகுதி எது?',
    optionsEn: ['Purananuru', 'Akananuru', 'Padirruppattu', 'Kalittokai'],
    optionsTa: ['புறநானூறு', 'அகநானூறு', 'பதிற்றுப்பத்து', 'கலித்தொகை'],
    correctAnswer: 1,
    explanationEn: 'Akananuru is a classical Sangam anthology of 400 poems dedicated to the inner world of love, emotional states, and marriage (Agam).',
    explanationTa: 'அகநானூறு என்பது அகப்பொருள் ஒழுக்கத்தை விரிவாக விளக்கும் 400 பாடல்களைக் கொண்ட எட்டுத்தொகை நூல்களில் ஒன்றாகும்.'
  },
  {
    id: 18,
    subject: 'Economy',
    textEn: 'In India, the Minimum Support Price (MSP) for agricultural crops is recommended by which body?',
    textTa: 'இந்தியாவில் விவசாயப் பயிர்களுக்கான குறைந்தபட்ச ஆதரவு விலையை (MSP) பரிந்துரைக்கும் அமைப்பு எது?',
    optionsEn: ['NABARD', 'Commission for Agricultural Costs and Prices (CACP)', 'FCI', 'Ministry of Finance'],
    optionsTa: ['நபார்டு (NABARD)', 'வேளாண் செலவுகள் மற்றும் விலைகளுக்கான ஆணையம் (CACP)', 'இந்திய உணவுக் கழகம் (FCI)', 'மத்திய நிதி அமைச்சகம்'],
    correctAnswer: 1,
    explanationEn: 'The Commission for Agricultural Costs and Prices (CACP) recommends MSPs for 22 mandated crops and fair price for sugarcane.',
    explanationTa: 'CACP (Commission for Agricultural Costs and Prices) அமைப்பு விளைபொருட்களின் உற்பத்திச் செலவுகளை ஆய்வு செய்து குறைந்தபட்ச ஆதரவு விலையை அரசுக்குப் பரிந்துரைக்கிறது.'
  },
  {
    id: 19,
    subject: 'Current Affairs',
    textEn: 'Which Indian space mission successfully landed a rover near the lunar south pole in August 2023?',
    textTa: 'ஆகஸ்ட் 2023-ல் நிலவின் தென் துருவப் பகுதிக்கு அருகே ரோவரை வெற்றிகரமாகத் தரையிறக்கிய இந்திய விண்வெளித் திட்டம் எது?',
    optionsEn: ['Mangalyaan 2', 'Chandrayaan-2', 'Chandrayaan-3', 'Aditya-L1'],
    optionsTa: ['மங்கள்யான் 2', 'சந்திரயான்-2', 'சந்திரயான்-3', 'ஆதித்யா-L1'],
    correctAnswer: 2,
    explanationEn: 'ISRO’s Chandrayaan-3 successfully touched down on the Moon on August 23, 2023, making India the first nation to soft-land near the lunar south polar region.',
    explanationTa: 'இஸ்ரோவின் சந்திரயான்-3 திட்டம் 23 ஆகஸ்ட் 2023 அன்று நிலவின் தென் துருவப் பகுதிக்கு அருகே வெற்றிகரமாகத் தரையிறங்கி இந்தியாவுக்கு உலக வரலாற்று வெற்றியை ஈட்டித் தந்தது.'
  },
  {
    id: 20,
    subject: 'General Science',
    textEn: 'Which cell organelle is universally referred to as the "Powerhouse of the Cell"?',
    textTa: 'செல்லின் "ஆற்றல் மையம்" (Powerhouse of the Cell) என்று அழைக்கப்படும் செல் நுண்ணுறுப்பு எது?',
    optionsEn: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Lysosome'],
    optionsTa: ['ரைபோசோம்', 'மைட்டோகாண்ட்ரியா (Mitochondria)', 'கோல்கை உறுப்பு', 'லைசோசோம்'],
    correctAnswer: 1,
    explanationEn: 'Mitochondria generate most of the chemical energy needed to power the cell’s biochemical reactions in the form of ATP (adenosine triphosphate).',
    explanationTa: 'மைட்டோகாண்ட்ரியா செல்லுக்குத் தேவையான ஆற்றலை ATP மூலக்கூறுகளாக உற்பத்தி செய்வதால் செல்லின் ஆற்றல் மையம் என்று அழைக்கப்படுகிறது.'
  },
  {
    id: 21,
    subject: 'Polity',
    textEn: 'Which schedule of the Constitution of India deals with the allocation of seats in the Rajya Sabha (Council of States)?',
    textTa: 'மாநிலங்களவையில் (Rajya Sabha) மாநிலங்கள் மற்றும் யூனியன் பிரதேசங்களுக்கான இடப்பங்கீடு பற்றிக் கூறும் அட்டவணை எது?',
    optionsEn: ['Third Schedule', 'Fourth Schedule', 'Fifth Schedule', 'Sixth Schedule'],
    optionsTa: ['மூன்றாவது அட்டவணை (பதவிப்பிரமாணம்)', 'நான்காவது அட்டவணை (மாநிலங்களவை இடங்கள்)', 'ஐந்தாவது அட்டவணை', 'ஆறாவது அட்டவணை'],
    correctAnswer: 1,
    explanationEn: 'The Fourth Schedule of the Indian Constitution specifies the allocation of seats to each State and Union Territory in the Rajya Sabha.',
    explanationTa: 'நான்காவது அட்டவணை இந்திய மாநிலங்கள் மற்றும் யூனியன் பிரதேசங்களுக்கு மாநிலங்களவையில் ஒதுக்கப்பட்டுள்ள இடங்களின் எண்ணிக்கையை விவரிக்கிறது.'
  },
  {
    id: 22,
    subject: 'History',
    textEn: 'Who founded the self-respect movement (Suya Mariyathai Iyakkam) in Tamil Nadu in the year 1925?',
    textTa: '1925-ஆம் ஆண்டு தமிழ்நாட்டில் சுயமரியாதை இயக்கத்தைத் தோற்றுவித்தவர் யார்?',
    optionsEn: ['C. N. Annadurai', 'Periyar E. V. Ramasamy', 'Rettaimalai Srinivasan', 'M. C. Rajah'],
    optionsTa: ['பேரறிஞர் அண்ணா', 'தந்தை பெரியார் ஈ.வே.ரா', 'இரட்டைமலை சீனிவாசன்', 'எம். சி. ராஜா'],
    correctAnswer: 1,
    explanationEn: 'Periyar E. V. Ramasamy founded the Self-Respect Movement in 1925 to promote rationalism, equality, women’s liberation, and eradication of caste discrimination.',
    explanationTa: '1925-ல் தந்தை பெரியாரால் சுயமரியாதை இயக்கம் தோற்றுவிக்கப்பட்டு சாதி ஒழிப்பு, பெண் விடுதலை, பகுத்தறிவு மற்றும் சமத்துவக் கொள்கைகள் தீவிரமாகப் பரப்பப்பட்டன.'
  },
  {
    id: 23,
    subject: 'Physics',
    textEn: 'What is the speed of light in vacuum?',
    textTa: 'வெற்றிடத்தில் ஒளியின் வேகம் (Speed of Light) தோராயமாக எவ்வளவு?',
    optionsEn: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '340 m/s'],
    optionsTa: ['3 × 10⁶ மீ/விநாடி', '3 × 10⁸ மீ/விநாடி (3 லட்சம் கி.மீ/விநாடி)', '3 × 10¹⁰ மீ/விநாடி', '340 மீ/விநாடி (காற்றில் ஒலியின் வேகம்)'],
    correctAnswer: 1,
    explanationEn: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second (299,792,458 m/s).',
    explanationTa: 'வெற்றிடத்தில் ஒளியின் வேகம் வினாடிக்கு சுமார் 3 × 10⁸ மீட்டர்கள் (3,00,000 கி.மீ/விநாடி) ஆகும்.'
  },
  {
    id: 24,
    subject: 'Polity',
    textEn: 'Money Bills in the Indian Parliament can only be introduced on the prior recommendation of whom?',
    textTa: 'இந்திய நாடாளுமன்றத்தில் பண மசோதா (Money Bill) யாருடைய முன் பரிந்துரையின் பேரில் மட்டுமே அறிமுகப்படுத்தப்பட முடியும்?',
    optionsEn: ['Prime Minister', 'Speaker of Lok Sabha', 'President of India', 'Union Finance Minister'],
    optionsTa: ['இந்தியப் பிரதமர்', 'மக்களவைத் தலைவர் (சபாநாயகர்)', 'இந்தியக் குடியரசுத் தலைவர்', 'மத்திய நிதி அமைச்சர்'],
    correctAnswer: 2,
    explanationEn: 'Under Article 117(1) of the Indian Constitution, a Money Bill can be introduced in Lok Sabha only with the prior recommendation of the President.',
    explanationTa: 'அரசியலமைப்பு விதி 117(1)-ன் படி, பண மசோதாவை இந்தியக் குடியரசுத் தலைவரின் முன் அனுமதியுடன் மட்டுமே மக்களவையில் அறிமுகப்படுத்த முடியும்.'
  },
  {
    id: 25,
    subject: 'Science',
    textEn: 'Which chemical element has the symbol "Fe" and atomic number 26?',
    textTa: '"Fe" என்ற குறியீடும், 26 என்ற அணு எண்ணும் கொண்ட தனிமம் எது?',
    optionsEn: ['Fluorine', 'Iron', 'Francium', 'Lead'],
    optionsTa: ['புளூரின் (Fluorine)', 'இரும்பு (Iron - Ferrum)', 'பிரான்சியம் (Francium)', 'ஈயம் (Lead)'],
    correctAnswer: 1,
    explanationEn: 'Iron has the chemical symbol Fe (from Latin: ferrum) and atomic number 26. It is the most common element on Earth by mass.',
    explanationTa: 'இரும்பின் லத்தீன் பெயர் "ஃபெர்ரம்" (Ferrum) என்பதால் அதன் குறியீடு Fe ஆகும். இதன் அணு எண் 26 ஆகும்.'
  }
];

/**
 * Generates an expanded set of unique questions for tests with larger question counts
 */
export function generateQuizQuestions(totalCount: number, baseCategory: string = 'General'): QuizQuestion[] {
  const result: QuizQuestion[] = [];
  const bank = coreQuestionBank;

  for (let i = 0; i < totalCount; i++) {
    const base = bank[i % bank.length];
    const cycle = Math.floor(i / bank.length);
    
    if (cycle === 0) {
      result.push({ ...base, id: i + 1 });
    } else {
      // Create a contextual variation so every question is numbered and uniquely presented
      result.push({
        id: i + 1,
        subject: base.subject,
        textEn: `[Q${i + 1} - ${base.subject}] ${base.textEn}`,
        textTa: `[கேள்வி ${i + 1} - ${base.subject}] ${base.textTa}`,
        optionsEn: [...base.optionsEn],
        optionsTa: [...base.optionsTa],
        correctAnswer: base.correctAnswer,
        explanationEn: base.explanationEn,
        explanationTa: base.explanationTa
      });
    }
  }

  return result;
}

export const initialFullMockQuizzes: MockQuizItem[] = [];

