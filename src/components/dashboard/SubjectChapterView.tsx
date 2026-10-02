import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle2, 
  FileDown, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Play, 
  HelpCircle, 
  ChevronRight, 
  Award, 
  Check, 
  Share2, 
  RotateCcw,
  Layers,
  ChevronLeft,
  CheckSquare,
  Eye,
  RefreshCw,
  Download
} from 'lucide-react';
import { formatVideoEmbed } from '../../lib/videoUtils';
import { getBlob, openPdfPreview, downloadPdfFile } from '../../lib/storage';

export interface SubjectItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

interface SubjectChapterViewProps {
  subject: SubjectItem;
  examName: string;
  language: 'english' | 'tamil';
  onLanguageChange?: (lang: 'english' | 'tamil') => void;
  initialChapter?: number | null;
  onBack: () => void;
  onOpenPdf?: (url: string) => void;
}

// 12 Chapters data mapped per subject
const chaptersRegistry: Record<string, Array<{
  number: number;
  titleEn: string;
  titleTa: string;
  duration: string;
  topicsCount: number;
  descriptionEn: string;
  descriptionTa: string;
}>> = {
  physics: [
    { number: 1, titleEn: 'Units, Measurements & Standards of Motion', titleTa: 'அளவீடுகள், அலகுகள் மற்றும் இயக்கவியல்', duration: '45 mins', topicsCount: 6, descriptionEn: 'SI Units, Scalars & Vectors, Newton\'s Three Laws of Motion, Friction and Circular Motion.', descriptionTa: 'SI அலகுகள், திசையிலிகள் மற்றும் திசையன்கள், நியூட்டனின் மூன்று இயக்க விதிகள், உராய்வு மற்றும் வட்ட இயக்கம்.' },
    { number: 2, titleEn: 'Work, Power, Energy & Friction', titleTa: 'வேலை, ஆற்றல், திறன் மற்றும் உராய்வு', duration: '50 mins', topicsCount: 5, descriptionEn: 'Work-energy theorem, conservation of kinetic & potential energy, power output.', descriptionTa: 'வேலை-ஆற்றல் தேற்றம், இயக்க மற்றும் நிலையாற்றல் பாதுகாப்பு விதிகள்.' },
    { number: 3, titleEn: 'Gravitation & Planetary Laws', titleTa: 'புவியீர்ப்பு மற்றும் கிரக இயக்க விதிகள்', duration: '40 mins', topicsCount: 4, descriptionEn: 'Newton\'s law of gravitation, Kepler\'s laws, escape velocity, and satellite motion.', descriptionTa: 'நியூட்டனின் ஈர்ப்பு விதி, கெப்ளரின் விதிகள் மற்றும் செயற்கைக்கோள் இயக்கம்.' },
    { number: 4, titleEn: 'Mechanics of Fluids & Surface Tension', titleTa: 'பாய்மங்களின் இயக்கவியல் மற்றும் பரப்பு இழுவிசை', duration: '45 mins', topicsCount: 5, descriptionEn: 'Pascal\'s law, Archimedes principle, buoyancy, viscosity, Bernoulli theorem.', descriptionTa: 'பாஸ்கல் விதி, ஆர்க்கிமிடிஸ் தத்துவம், மிதத்தல் விதிகள், பெர்னௌலி தேற்றம்.' },
    { number: 5, titleEn: 'Heat, Thermodynamics & Gas Laws', titleTa: 'வெப்பம் மற்றும் வெப்ப இயக்கவியல் விதிகள்', duration: '55 mins', topicsCount: 6, descriptionEn: 'Temperature scales, heat transfer, laws of thermodynamics, and specific heat capacity.', descriptionTa: 'வெப்பநிலை அளவுகோல்கள், வெப்பப் பரிமாற்றம், வெப்ப இயக்கவியல் விதிகள்.' },
    { number: 6, titleEn: 'Acoustics & Wave Motion', titleTa: 'ஒலியியல் மற்றும் அலை இயக்கம்', duration: '40 mins', topicsCount: 5, descriptionEn: 'Transverse & longitudinal waves, speed of sound, Doppler effect, ultrasonic applications.', descriptionTa: 'குறுக்கலை, நெட்டலை, ஒலியின் வேகம், டாப்ளர் விளைவு மற்றும் அல்ட்ராசோனிக் பயன்கள்.' },
    { number: 7, titleEn: 'Optics, Reflection & Refraction', titleTa: 'ஒளியியல், எதிரொளிப்பு மற்றும் ஒளிவிலகல்', duration: '60 mins', topicsCount: 7, descriptionEn: 'Mirrors, lenses, total internal reflection, dispersion, and human eye defects.', descriptionTa: 'ஆடிகள், லென்ஸ்கள், முழு அக எதிரொளிப்பு, நிறப்பிரிகை மற்றும் கண் குறைபாடுகள்.' },
    { number: 8, titleEn: 'Electricity & Electric Current', titleTa: 'மின்னியல் மற்றும் மின்னோட்டம்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Ohm\'s law, resistance combinations, heating effect of electric current, domestic wiring.', descriptionTa: 'ஓம் விதி, மின்தடை இணைப்புகள், மின்னோட்டத்தின் வெப்ப விளைவு, வீட்டு மின்சுற்றுகள்.' },
    { number: 9, titleEn: 'Magnetism & Electromagnetism', titleTa: 'காந்தவியல் மற்றும் மின்காந்தவியல்', duration: '45 mins', topicsCount: 5, descriptionEn: 'Magnetic fields, Earth\'s magnetism, Fleming\'s rules, and electromagnetic induction.', descriptionTa: 'காந்தப்புலம், புவிகாந்தம், ஃபிளெமிங்கின் விதிகள் மற்றும் மின்காந்தத் தூண்டல்.' },
    { number: 10, titleEn: 'Atomic & Nuclear Physics', titleTa: 'அணு மற்றும் அணுக்கரு இயற்பியல்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Radioactivity, nuclear fission & fusion, reactors in Tamil Nadu, and radiation safety.', descriptionTa: 'கதிரியக்கம், அணுக்கரு பிளவு மற்றும் இணைவு, தமிழ்நாட்டின் அணுமின் நிலையங்கள்.' },
    { number: 11, titleEn: 'Modern Physics & Semiconductors', titleTa: 'நவீன இயற்பியல் மற்றும் குறைக்கடத்திகள்', duration: '45 mins', topicsCount: 5, descriptionEn: 'Photoelectric effect, Diodes, transistors, solar cells, and LED technology.', descriptionTa: 'ஒளிமின் விளைவு, டையோடு, டிரான்சிஸ்டர், சூரிய மின்கலங்கள், LED தொழில்நுட்பம்.' },
    { number: 12, titleEn: 'Space Science, Satellites & ISRO Missions', titleTa: 'விண்வெளி அறிவியல் மற்றும் இஸ்ரோ திட்டங்கள்', duration: '55 mins', topicsCount: 6, descriptionEn: 'Chandrayaan, Gaganyaan, Aditya-L1, PSLV, GSLV, and Kulasekharapatnam spaceport.', descriptionTa: 'சந்திரயான், ககன்யான், ஆதித்யா-L1, பிஎஸ்எல்வி, குலசேகரப்பட்டினம் ஏவுதளம்.' }
  ],
  polity: [
    { number: 1, titleEn: 'Historical Background & Making of the Constitution', titleTa: 'வரலாற்று பின்னணி மற்றும் அரசியலமைப்பு உருவாக்கம்', duration: '55 mins', topicsCount: 7, descriptionEn: 'Acts under East India Company & British Crown, Constituent Assembly, Drafting Committee, and Enactment.', descriptionTa: 'பிரிட்டிஷ் கால சட்டங்கள், இந்திய அரசியலமைப்பு நிர்ணய சபை, வரைவுக் குழு மற்றும் அமலாக்கம்.' },
    { number: 2, titleEn: 'Preamble, Union & Its Territory', titleTa: 'முகப்புரை மற்றும் இந்திய ஒன்றியம்', duration: '45 mins', topicsCount: 5, descriptionEn: 'Key terms of Preamble, Articles 1-4, Reorganization of States, and Linguistic provinces.', descriptionTa: 'முகப்புரையின் முக்கிய சொற்கள், சரத்து 1-4, மாநிலங்கள் மறுசீரமைப்பு மற்றும் மொழிவாரி மாநிலங்கள்.' },
    { number: 3, titleEn: 'Citizenship & Fundamental Rights (Part III)', titleTa: 'குடியுரிமை மற்றும் அடிப்படை உரிமைகள்', duration: '75 mins', topicsCount: 8, descriptionEn: 'Articles 12 to 35, Six Fundamental Rights, Writs under Article 32, and Landmark Supreme Court Cases.', descriptionTa: 'சரத்து 12 முதல் 35, ஆறு அடிப்படை உரிமைகள், நீதிப் பேராணைகள் (சரத்து 32).' },
    { number: 4, titleEn: 'Directive Principles of State Policy (DPSP)', titleTa: 'அரசு வழிகாட்டு நெறிமுறைகள் (DPSP)', duration: '45 mins', topicsCount: 5, descriptionEn: 'Part IV (Articles 36-51), Socialistic, Gandhian & Liberal principles, Fundamental Rights vs DPSP.', descriptionTa: 'பகுதி IV, சோசலிச, காந்திய மற்றும் தாராளவாத கோட்பாடுகள்.' },
    { number: 5, titleEn: 'Fundamental Duties & Amendment Procedure', titleTa: 'அடிப்படை கடமைகள் மற்றும் அரசியலமைப்பு திருத்தம்', duration: '40 mins', topicsCount: 4, descriptionEn: 'Swaran Singh Committee, 11 Fundamental Duties (Article 51A), and Article 368 Amendment Process.', descriptionTa: 'சுவரன் சிங் குழு, 11 அடிப்படை கடமைகள் (சரத்து 51A) மற்றும் சட்டத்திருத்த முறை (சரத்து 368).' },
    { number: 6, titleEn: 'The Union Executive - President, VP & PM', titleTa: 'மத்திய நிர்வாகம் - குடியரசுத் தலைவர், பிரதமர்', duration: '65 mins', topicsCount: 7, descriptionEn: 'Election, powers, veto, ordinances of President (Art 123), Cabinet and Council of Ministers.', descriptionTa: 'குடியரசு தலைவர் தேர்தல், அதிகாரங்கள், அவசர சட்டங்கள் (123), அமைச்சரவை.' },
    { number: 7, titleEn: 'The Parliament of India - Lok Sabha & Rajya Sabha', titleTa: 'இந்திய நாடாளுமன்றம் - மக்களவை, மாநிலங்களவை', duration: '70 mins', topicsCount: 8, descriptionEn: 'Parliamentary procedures, Budget, Money Bills vs Financial Bills, Committees, Speaker\'s Role.', descriptionTa: 'நாடாளுமன்ற நடைமுறைகள், பட்ஜெட், பண மசோதா, நிலைக்குழுக்கள், சபாநாயகர் அதிகாரம்.' },
    { number: 8, titleEn: 'Union & State Judiciary - Supreme Court & High Courts', titleTa: 'நீதித்துறை - உச்சநீதிமன்றம் மற்றும் உயர்நீதிமன்றங்கள்', duration: '60 mins', topicsCount: 6, descriptionEn: 'Judicial Review, collegium system, jurisdictions, Public Interest Litigation (PIL).', descriptionTa: 'நீதித்துறை மறுஆய்வு, கொலீஜியம் முறை, பொதுநல வழக்குகள் (PIL).' },
    { number: 9, titleEn: 'State Government - Governor, CM & Legislature', titleTa: 'மாநில அரசு - ஆளுநர், முதலமைச்சர், சட்டமன்றம்', duration: '50 mins', topicsCount: 5, descriptionEn: 'Governor\'s discretionary powers (Article 163), Chief Minister, State Legislative Assembly & Council.', descriptionTa: 'ஆளுநரின் விருப்ப அதிகாரங்கள், முதலமைச்சர், மாநில சட்டமன்றம்.' },
    { number: 10, titleEn: 'Local Governance - Panchayati Raj & Municipalities', titleTa: 'உள்ளாட்சி அமைப்புகள் - பஞ்சாயத்து ராஜ் மற்றும் நகராட்சிகள்', duration: '55 mins', topicsCount: 6, descriptionEn: '73rd & 74th Amendments, 11th & 12th Schedules, 3-Tier system, Tamil Nadu Panchayat Act 1994.', descriptionTa: '73 & 74வது சட்டத்திருத்தங்கள், 11 & 12வது அட்டவணைகள், தமிழ்நாடு பஞ்சாயத்து சட்டம் 1994.' },
    { number: 11, titleEn: 'Constitutional & Statutory Bodies', titleTa: 'அரசியலமைப்பு மற்றும் சட்டரீதியான அமைப்புகள்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Election Commission, UPSC, TNPSC, CAG, Finance Commission, Attorney General, NITI Aayog.', descriptionTa: 'தேர்தல் ஆணையம், UPSC, TNPSC, சி.ஏ.ஜி, நிதிக்குழு, நிதி ஆயோக்.' },
    { number: 12, titleEn: 'Emergency Provisions & Center-State Relations', titleTa: 'நெருக்கடி நிலை மற்றும் மத்திய-மாநில உறவுகள்', duration: '50 mins', topicsCount: 5, descriptionEn: 'National, State & Financial Emergencies (Arts 352, 356, 360), Sarkaria & Punchhi Commissions.', descriptionTa: 'தேசிய, மாநில மற்றும் நிதி அவசரநிலைகள், சர்க்காரியா ஆணையம்.' }
  ],
  history: [
    { number: 1, titleEn: 'Advent of Europeans & British Conquest', titleTa: 'ஐரோப்பியர்களின் வருகை மற்றும் பிரிட்டிஷ் ஆதிக்கம்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Portuguese, Dutch, British East India Company, Carnatic Wars, Battle of Plassey and Buxar.', descriptionTa: 'போர்ச்சுகீசியர், டச்சு, பிரிட்டிஷ் கிழக்கிந்திய கம்பெனி, கர்நாடகப் போர்கள், பிளாசிப் போர்.' },
    { number: 2, titleEn: 'Early Uprisings & The Great Revolt of 1857', titleTa: 'ஆரம்பகால கிளர்ச்சிகள் மற்றும் 1857 பெரும் புரட்சி', duration: '55 mins', topicsCount: 6, descriptionEn: 'Vellore Mutiny 1806, causes and centers of 1857 revolt, Queen Victoria\'s Proclamation 1858.', descriptionTa: 'வேலூர் புரட்சி 1806, 1857 பெரும் புரட்சியின் காரணங்கள் மற்றும் விக்டோரியா மகாராணி அறிக்கை.' },
    { number: 3, titleEn: 'Socio-Religious Reform Movements', titleTa: 'சமூக-சமய சீர்திருத்த இயக்கங்கள்', duration: '45 mins', topicsCount: 5, descriptionEn: 'Brahmo Samaj, Arya Samaj, Ramakrishna Mission, Aligarh movement, Jyotirao Phule.', descriptionTa: 'பிரம்ம சமாஜம், ஆரிய சமாஜம், ராமகிருஷ்ண மடம், அலிகார் இயக்கம், ஜோதிராவ் பூலே.' },
    { number: 4, titleEn: 'Rise of Indian Nationalism & Early Phase (1885-1905)', titleTa: 'இந்திய தேசிய எழுச்சி மற்றும் ஆரம்ப கட்டம்', duration: '40 mins', topicsCount: 5, descriptionEn: 'Formation of INC, Moderate leaders (Dadabhai Naoroji, Gokhale), Drain of Wealth theory.', descriptionTa: 'காங்கிரஸ் உருவாக்கம், மிதவாதிகள், செல்வச் சுரண்டல் கோட்பாடு.' },
    { number: 5, titleEn: 'Swadeshi Movement & Revolutionary Nationalism', titleTa: 'சுதேசி இயக்கம் மற்றும் தீவிர தேசியவாதம்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Partition of Bengal 1905, Lal-Bal-Pal, V.O. Chidambaranar & Swadeshi Steam Navigation, Subramania Bharati.', descriptionTa: 'வங்கப் பிரிவினை 1905, வ.உ.சிதம்பரனாரின் சுதேசி கப்பல் நிறுவனம், பாரதியாரின் பங்கு.' },
    { number: 6, titleEn: 'Gandhian Era - Non-Cooperation Movement', titleTa: 'காந்திய சகாப்தம் - ஒத்துழையாமை இயக்கம்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Champaran, Rowlatt Act, Jallianwala Bagh, Khilafat, Non-Cooperation and Chauri Chaura.', descriptionTa: 'சம்பரான், ரௌலட் சட்டம், ஜாலியன் வாலாபாக் படுகொலை, ஒத்துழையாமை இயக்கம்.' },
    { number: 7, titleEn: 'Civil Disobedience & Round Table Conferences', titleTa: 'சட்டமறுப்பு இயக்கம் மற்றும் வட்டமேஜை மாநாடுகள்', duration: '50 mins', topicsCount: 5, descriptionEn: 'Dandi March, Vedaranyam Salt Satyagraha by Rajaji, Gandhi-Irwin Pact, Poona Pact.', descriptionTa: 'தண்டி யாத்திரை, ராஜாஜியின் வேதாரண்யம் உப்பு சத்தியாகிரகம், பூனா ஒப்பந்தம்.' },
    { number: 8, titleEn: 'Quit India Movement & INA (Subhash Chandra Bose)', titleTa: 'வெள்ளையனே வெளியேறு மற்றும் சுபாஷ் சந்திரபோஸ்', duration: '55 mins', topicsCount: 6, descriptionEn: 'Cripps Mission, "Do or Die" call 1942, Indian National Army (INA) and Rani of Jhansi regiment.', descriptionTa: 'கிரிப்ஸ் தூதுக்குழு, 1942 "செய் அல்லது செத்துமடி", இந்திய தேசிய ராணுவம்.' },
    { number: 9, titleEn: 'Independence, Partition & Integration of States', titleTa: 'சுதந்திரம், பிரிவினை மற்றும் சமஸ்தானங்கள் இணைப்பு', duration: '45 mins', topicsCount: 5, descriptionEn: 'Cabinet Mission, Mountbatten Plan, Indian Independence Act 1947, Sardar Patel\'s integration.', descriptionTa: 'மவுண்ட்பேட்டன் திட்டம், இந்திய சுதந்திர சட்டம் 1947, சர்தார் படேலின் சமஸ்தானங்கள் இணைப்பு.' },
    { number: 10, titleEn: 'Ancient India - Indus Valley Civilization & Vedic Age', titleTa: 'பண்டைய இந்தியா - சிந்துவெளி நாகரிகம் மற்றும் வேத காலம்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Harappa, Mohenjo-daro, town planning, Keezhadi excavations linkage, Early & Later Vedic society.', descriptionTa: 'ஹரப்பா, மொகஞ்சதாரோ, கீழடி அகழாய்வு தொடர்புகள், வேதகால சமூகம்.' },
    { number: 11, titleEn: 'Sangam Age & Great Dynasties of South India', titleTa: 'சங்க காலம் மற்றும் தென்னிந்திய பேரரசுகள்', duration: '60 mins', topicsCount: 7, descriptionEn: 'Chera, Chola, Pandya kingdoms, Sangam literature, Pallavas architecture, Chola local governance.', descriptionTa: 'சேர, சோழ, பாண்டியர், சங்க இலக்கியங்கள், சோழர்களின் கிராம நிர்வாக முறை.' },
    { number: 12, titleEn: 'Justice Party & Dravidian Movement in Tamil Nadu', titleTa: 'நீதிக்கட்சி மற்றும் திராவிட இயக்கம்', duration: '55 mins', topicsCount: 6, descriptionEn: 'South Indian Liberal Federation (1916), Communal G.O., Periyar E.V.R., Self-Respect Movement, C.N. Annadurai.', descriptionTa: 'தென்னிந்திய நல உரிமைச் சங்கம் (1916), வகுப்புவாரி உரிமை ஆணை, தந்தை பெரியார், பேரறிஞர் அண்ணா.' }
  ],
  maths: [
    { number: 1, titleEn: 'Simplification, BODMAS & Number Systems', titleTa: 'சுருக்குதல், BODMAS விதி மற்றும் எண் முறைகள்', duration: '50 mins', topicsCount: 6, descriptionEn: 'BODMAS rules, fractions, decimals, recurring decimals, divisibility rules, and unit digit concepts.', descriptionTa: 'BODMAS முன்னுரிமை விதிகள், பின்னங்கள், பதின்ம எண்கள், வகுபடும் தன்மைகள் மற்றும் கடைசி இலக்கம் கண்டறிதல்.' },
    { number: 2, titleEn: 'HCF and LCM (Highest Common Factor & Lowest Common Multiple)', titleTa: 'மீப்பெரு பொது காரணி (HCF) & மீச்சிறு பொது மடங்கு (LCM)', duration: '45 mins', topicsCount: 5, descriptionEn: 'Prime factorization, division method, fraction HCF/LCM, bell ringing and traffic light problems.', descriptionTa: 'பகா காரணி முறை, பின்னங்களின் மீ.பொ.வ மற்றும் மீ.சி.ம, மணிகள் ஒலிக்கும் கணக்குகள்.' },
    { number: 3, titleEn: 'Percentages, Profit, Loss & Discount', titleTa: 'சதவீதம், இலாபம்-நட்டம் மற்றும் தள்ளுபடி', duration: '60 mins', topicsCount: 7, descriptionEn: 'Percentage conversions, successive percentage change, cost price, selling price, marked price & discount.', descriptionTa: 'சதவீத மாற்றங்கள், அடக்க விலை, விற்ற விலை, குறித்த விலை மற்றும் தள்ளுபடி கணக்கீடுகள்.' },
    { number: 4, titleEn: 'Ratio, Proportion & Partnership', titleTa: 'விகிதம், விகிதாச்சாரம் மற்றும் கூட்டாண்மை', duration: '45 mins', topicsCount: 5, descriptionEn: 'Direct and inverse proportions, compound ratio, mean proportional, and profit sharing in partnerships.', descriptionTa: 'நேர்விகிதம், எதிர்விகிதம், கூட்டு விகிதம் மற்றும் கூட்டாண்மை இலாபப் பகிர்வு கணக்குகள்.' },
    { number: 5, titleEn: 'Simple Interest & Compound Interest', titleTa: 'தனிவட்டி மற்றும் கூட்டுவட்டி', duration: '55 mins', topicsCount: 6, descriptionEn: 'SI formula, annual/half-yearly CI compounding, difference between CI and SI for 2 & 3 years.', descriptionTa: 'தனிவட்டி சூத்திரம், ஆண்டு மற்றும் அரையாண்டு கூட்டுவட்டி, தனிவட்டி-கூட்டுவட்டி வேறுபாடு.' },
    { number: 6, titleEn: 'Time and Work, Pipes & Cisterns', titleTa: 'நேரம் மற்றும் வேலை, குழாய்கள் மற்றும் தொட்டிகள்', duration: '55 mins', topicsCount: 6, descriptionEn: 'Unitary work method, efficiency ratios, alternate day work, inlet and outlet leakage problems.', descriptionTa: 'வேலை-நாட்கள் தொடர்பு, திறன் விகிதம், ஒன்றுவிட்ட நாட்கள் வேலை, குழாய்கள் மற்றும் கசிவு கணக்குகள்.' },
    { number: 7, titleEn: 'Time, Speed, Distance & Trains', titleTa: 'நேரம், வேகம், தொலைவு மற்றும் ரயில்கள்', duration: '50 mins', topicsCount: 6, descriptionEn: 'km/h to m/s conversion, relative speed, train crossing platform/pole, and boats & streams.', descriptionTa: 'வேக மாற்றம், சார்பு வேகம், ரயில்கள் பாலம்/கம்பம் கடக்கும் நேரம், படகு மற்றும் ஓடை கணக்குகள்.' },
    { number: 8, titleEn: 'Mensuration 2D - Area & Perimeter', titleTa: 'அளவியல் 2D - பரப்பளவு மற்றும் சுற்றளவு', duration: '55 mins', topicsCount: 6, descriptionEn: 'Triangles, rectangles, squares, rhombus, trapezium, circle, semicircle, and path area calculation.', descriptionTa: 'முக்கோணம், செவ்வகம், சதுரம், சாய் சதுரம், வட்டம் மற்றும் பாதை பரப்பளவு வாய்ப்பாடுகள்.' },
    { number: 9, titleEn: 'Mensuration 3D - Surface Area & Volume', titleTa: 'அளவியல் 3D - கனஅளவு மற்றும் புறப்பரப்பளவு', duration: '60 mins', topicsCount: 6, descriptionEn: 'Cube, cuboid, cylinder, cone, sphere, hemisphere, frustum, and melting/recasting problems.', descriptionTa: 'கனசதுரம், கனசெவ்வகம், உருளை, கூம்பு, கோளம் மற்றும் உருக்கி வார்க்கப்படும் கணக்குகள்.' },
    { number: 10, titleEn: 'Averages, Ages & Mixtures / Alligations', titleTa: 'சராசரி, வயது கணக்குகள் மற்றும் கலவைகள்', duration: '45 mins', topicsCount: 5, descriptionEn: 'Weighted average, age problem equations, alligation rule, and mixture replacement problems.', descriptionTa: 'சராசரி சூத்திரங்கள், வயது தொடர்பான சமன்பாடுகள், கலவை விகிதங்கள் மற்றும் பதிலீடு கணக்குகள்.' },
    { number: 11, titleEn: 'Probability, Permutations & Combinations', titleTa: 'நிகழ்தகவு, வரிசைமாற்றம் மற்றும் சேர்வு', duration: '50 mins', topicsCount: 5, descriptionEn: 'Factorials, nPr, nCr, coin tosses, dice rolls, playing card probabilities, and independent events.', descriptionTa: 'காரணிப்பெருக்கம், வரிசைமாற்றம், சேர்வு, நாணயம், பகடை மற்றும் சீட்டுக்கட்டு நிகழ்தகவுகள்.' },
    { number: 12, titleEn: 'Data Interpretation, Graphs & Tabulation', titleTa: 'விவரங்களை விளக்குதல், வரைபடங்கள் மற்றும் அட்டவணைகள்', duration: '55 mins', topicsCount: 6, descriptionEn: 'Bar charts, pie charts, line graphs, tabular data analysis, and percentage growth trends.', descriptionTa: 'பட்டை வரைபடம், வட்ட விளக்கப்படம், கோட்டு வரைபடம் மற்றும் அட்டவணை தரவு பகுப்பாய்வு.' }
  ],
  reasoning: [
    { number: 1, titleEn: 'Coding-Decoding & Letter-Number Series', titleTa: 'குறியீட்டு முறைகள் மற்றும் எழுத்து-எண் தொடர்கள்', duration: '45 mins', topicsCount: 6, descriptionEn: 'Alphabetical positional values, reverse letters, letter shifting, number coding, and pattern logic.', descriptionTa: 'ஆங்கில எழுத்துக்களின் இடமதிப்பு, எதிர் எழுத்துக்கள், இடப்பெயர்ச்சி மற்றும் எண் குறியீடுகள்.' },
    { number: 2, titleEn: 'Analogy & Classification (Odd One Out)', titleTa: 'ஒப்புமை மற்றும் வகைப்படுத்துதல் (பொருந்தாததை தேர்வு செய்தல்)', duration: '40 mins', topicsCount: 5, descriptionEn: 'Word analogy, number analogy, semantic relationships, and identifying odd terms.', descriptionTa: 'சொல் ஒப்புமை, எண் ஒப்புமை, பொதுவான தொடர்புகள் மற்றும் பொருந்தாத சொல்லைக் கண்டறிதல்.' },
    { number: 3, titleEn: 'Direction Sense & Distance Test', titleTa: 'திசை அறிவு மற்றும் தொலைவு சோதனைகள்', duration: '40 mins', topicsCount: 5, descriptionEn: 'Cardinals (N, S, E, W), sub-directions, angle turns, Pythagoras theorem, and shadow directions.', descriptionTa: 'முதன்மைத் திசைகள், மூலைத் திசைகள், கோணத் திருப்பங்கள், பிதாகரஸ் தேற்றம் மற்றும் நிழல் திசை.' },
    { number: 4, titleEn: 'Blood Relations & Family Tree Analysis', titleTa: 'இரத்த உறவுகள் மற்றும் குடும்ப வரைபட பகுப்பாய்வு', duration: '45 mins', topicsCount: 5, descriptionEn: 'Generational hierarchy, maternal/paternal relationships, coded blood relations, and portrait-pointing puzzles.', descriptionTa: 'தலைமுறை படிநிலைகள், தாய்/தந்தை வழி உறவுகள், குறியீட்டு உறவு மற்றும் புகைப்பட புதிர் வினாக்கள்.' },
    { number: 5, titleEn: 'Syllogism & Venn Diagrams', titleTa: 'முடிவெடுத்தல் (Syllogism) மற்றும் வென் வரைபடங்கள்', duration: '55 mins', topicsCount: 6, descriptionEn: 'Universal affirmative/negative statements, Venn diagram overlays, "Some/All/No", and either-or cases.', descriptionTa: 'அனைத்தும், சில, எதுவுமில்லை கூற்றுகள், வென் வரைபட பகுப்பாய்வு மற்றும் தர்க்க முடிவுகள்.' },
    { number: 6, titleEn: 'Seating Arrangements - Linear & Circular', titleTa: 'இருக்கை அமைப்பு - நேர்கோடு மற்றும் வட்ட வடிவம்', duration: '60 mins', topicsCount: 6, descriptionEn: 'Facing center/outward, row arrangement facing North/South, double row parallel seating.', descriptionTa: 'மையத்தை நோக்கிய/எதிரான வட்ட இருக்கை, வடக்கு/தெற்கு நோக்கிய வரிசை இருக்கை அமைப்புகள்.' },
    { number: 7, titleEn: 'Order, Ranking & Sequence Test', titleTa: 'வரிசைமுறை மற்றும் தரவரிசை சோதனை', duration: '40 mins', topicsCount: 4, descriptionEn: 'Total persons formula: (Left + Right - 1), position interchanging, and ascending/descending comparisons.', descriptionTa: 'மொத்த நபர்கள் சூத்திரம் (இடது + வலது - 1), இடமாற்ற வினாக்கள் மற்றும் உயர/எடை ஒப்பீடுகள்.' },
    { number: 8, titleEn: 'Mathematical Operations & Arithmetical Reasoning', titleTa: 'கணிதக் குறிகள் மற்றும் எண்கணித காரணவியல்', duration: '45 mins', topicsCount: 5, descriptionEn: 'Symbol substitution (+ means ×), balancing equations, head and feet problems (animals/birds).', descriptionTa: 'குறியீட்டு மாற்றீடு (+ என்பது ×), சமன்பாடுகளை சமன் செய்தல் மற்றும் தலை-கால்கள் கணக்குகள்.' },
    { number: 9, titleEn: 'Clock, Calendar & Time Logic', titleTa: 'கடிகாரம் மற்றும் நாட்காட்டி கணக்குகள்', duration: '50 mins', topicsCount: 6, descriptionEn: 'Angle between hands (|30H - 5.5M|), coincidence/opposite hands, leap years, and odd days counting.', descriptionTa: 'கடிகார முட்களுக்கு இடைப்பட்ட கோணம், ஒன்று சேரும் நேரம், லீப் ஆண்டுகள் மற்றும் அதிகப்படியான நாட்கள்.' },
    { number: 10, titleEn: 'Non-Verbal Reasoning - Mirror, Water Images & Paper Folding', titleTa: 'சொல் சாரா காரணவியல் - பிம்பங்கள் மற்றும் காகித மடிப்பு', duration: '45 mins', topicsCount: 5, descriptionEn: 'Mirror reflection, water inversion, paper folding, punching patterns, and embedded figures.', descriptionTa: 'கண்ணாடி பிம்பம், நீர் பிம்பம், காகித மடிப்பு-வெட்டுதல் மற்றும் பொதிந்துள்ள படங்கள்.' },
    { number: 11, titleEn: 'Statement & Assumptions, Arguments & Conclusions', titleTa: 'கூற்று மற்றும் அனுமானங்கள், வாதங்கள் & முடிவுகள்', duration: '50 mins', topicsCount: 5, descriptionEn: 'Implicit assumptions, strong vs weak arguments, courses of action, and cause-and-effect reasoning.', descriptionTa: 'உட்கிடை அனுமானங்கள், வலிமையான வாதங்கள், மேற்கொள்ள வேண்டிய நடவடிக்கைகள் மற்றும் காரண-காரியம்.' },
    { number: 12, titleEn: 'Puzzles, Box Logic & Floor Arrangement', titleTa: 'புதிர்கள், பெட்டி மற்றும் அடுக்கு மாடி அமைப்புகள்', duration: '60 mins', topicsCount: 6, descriptionEn: 'Multi-variable puzzles, 7-floor building logic, box stacking, and day-month scheduling.', descriptionTa: 'பல மாறி புதிர்கள், 7 அடுக்கு மாடி வினாக்கள், பெட்டிகள் அடுக்குதல் மற்றும் அட்டவணை திட்டமிடல்.' }
  ]
};

// Fallback generator for other subjects (Geography, Chemistry, Biology, Tamil, English, etc.)
function getSubjectChapters(subjectId: string, subjectName: string) {
  if (chaptersRegistry[subjectId]) {
    return chaptersRegistry[subjectId];
  }
  return Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    titleEn: `Chapter ${i + 1}: ${subjectName} Core Foundations & Applications Part ${i + 1}`,
    titleTa: `அத்தியாயம் ${i + 1}: ${subjectName} அடிப்படை கோட்பாடுகள் பகுதி ${i + 1}`,
    duration: `${40 + (i % 4) * 5} mins`,
    topicsCount: 5 + (i % 3),
    descriptionEn: `Core topics, exam analysis, and high-probability questions for ${subjectName} Unit ${i + 1}.`,
    descriptionTa: `${subjectName} பாடத்தின் பகுதி ${i + 1} குறித்த முக்கிய குறிப்புகள் மற்றும் மாதிரி வினாக்கள்.`
  }));
}

// Chapter 1 Detailed Rich Content
const chapterOneContents: Record<string, {
  summaryEn: string;
  summaryTa: string;
  keyPoints: Array<{ title: string; desc: string; titleTa?: string; descTa?: string }>;
  videoUrl: string;
  videoTitle: string;
  pdfTitle: string;
  quiz: Array<{
    question: string;
    questionTa?: string;
    options: string[];
    optionsTa?: string[];
    correct: number;
    explanation: string;
    explanationTa?: string;
  }>;
}> = {
  physics: {
    summaryEn: `Nature of Universe - Measurement of physical quantities - General scientific laws in motion - force, pressure, and energy`,
    summaryTa: `பிரபஞ்சத்தின் இயல்பு - இயற்பியல் அளவுகளின் அளவீடு - இயக்கவியல் விதிகள் - விசை, அழுத்தம் மற்றும் ஆற்றல் தொடர்பான TNPSC பாடத்திட்டக் குறிப்புகள்.`,
    keyPoints: [
      { 
        title: '1. Nature of Universe', 
        desc: 'Basic Definitions & Measurement Units, Origin Theories & Galaxies, The Solar System, Other Celestial Objects, Quick Facts & Revisions for Exam Day.',
        titleTa: '1. பிரபஞ்சத்தின் இயல்பு மற்றும் அண்டவியல்',
        descTa: 'அடிப்படை வரையறைகள் & அளவீட்டு அலகுகள், அண்டத்தின் தோற்றம், விண்மீன் திரள்கள், சூரிய குடும்பம் மற்றும் கோள்களின் பண்புகள்.'
      },
      { 
        title: '2. Measurement of physical quantities', 
        desc: 'SI Base units (m, kg, s, A, K, mol, cd), Derived Units, and Dimensional Formulas for competitive examinations.',
        titleTa: '2. இயற்பியல் அளவுகளின் அளவீடு & SI அலகுகள்',
        descTa: 'அடிப்படை SI அலகுகள் (மீட்டர், கிலோகிராம், வினாடி, ஆம்பியர், கெல்வின், மோல், கேண்டெலா), வழி அலகுகள் மற்றும் பரிமாண வாய்ப்பாடுகள்.'
      },
      { 
        title: '3. General scientific laws in motion', 
        desc: 'Newton\'s three laws of motion, inertia of rest and motion, momentum, centripetal/centrifugal forces, and friction in machines.',
        titleTa: '3. இயக்கவியல் பொது அறிவியல் விதிகள்',
        descTa: 'நியூட்டனின் மூன்று இயக்க விதிகள், நிலைமத்தின் வகைகள் (ஓய்வு, இயக்கம், திசை), உந்தம் மற்றும் மையநோக்கு/மையவிலக்கு விசைகள்.'
      },
      { 
        title: '4. force, pressure, and energy', 
        desc: 'Gravitation laws, fluid pressure principles (Pascal & Archimedes), work-energy theorem, and conservation of kinetic and potential energy.',
        titleTa: '4. விசை, அழுத்தம் மற்றும் ஆற்றல் கோட்பாடுகள்',
        descTa: 'புவியீர்ப்பு விதி, பாஸ்கல் மற்றும் ஆர்க்கிமிடிஸ் பாய்ம அழுத்த விதிகள், வேலை-ஆற்றல் தேற்றம் மற்றும் ஆற்றல் மாறாக் கோட்பாடு.'
      }
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kY73_5Vq-uU',
    videoTitle: 'Complete Chapter 1: Units, Dimensions & Laws of Motion (Civil Services Masterclass)',
    pdfTitle: 'Agamakizh_Physics_Chapter1_Comprehensive_Notes.pdf',
    quiz: [
      {
        question: 'What is the average distance represented by one Astronomical Unit (AU), commonly used to measure distances within our solar system?',
        questionTa: 'சூரியக் குடும்பத்திற்குள் உள்ள தொலைவுகளை அளவிடப் பயன்படும் ஒரு வானியல் அலகு (AU) குறிக்கும் சராசரி தொலைவு என்ன?',
        options: ['1.496 × 10¹¹ m (149.6 Million km)', '9.46 × 10¹⁵ m (Light Year)', '3.08 × 10¹⁶ m (Parsec)', '3 × 10⁸ m/s (Speed of Light)'],
        optionsTa: ['1.496 × 10¹¹ மீ (149.6 மில்லியன் கி.மீ)', '9.46 × 10¹⁵ மீ (ஒளி ஆண்டு)', '3.08 × 10¹⁶ மீ (விண்ணியல் ஆரம்)', '3 × 10⁸ மீ/வி (ஒளியின் வேகம்)'],
        correct: 0,
        explanation: '1 Astronomical Unit (AU) is the mean distance between the Earth and the Sun, equal to 1.496 × 10¹¹ meters.',
        explanationTa: '1 வானியல் அலகு (AU) என்பது பூமிக்கும் சூரியனுக்கும் இடைப்பட்ட சராசரி தொலைவு ஆகும். இதன் மதிப்பு 1.496 × 10¹¹ மீட்டர்கள் (சுமார் 149.6 மில்லியன் கி.மீ).'
      },
      {
        question: 'Rocket propulsion is an application of which fundamental physical law?',
        questionTa: 'ராக்கெட் ஏவுதல் எந்த அடிப்படை இயற்பியல் விதியின் பயன்பாடாகும்?',
        options: ['Conservation of Linear Momentum', 'Bernoulli\'s Principle', 'Pascal\'s Law', 'Law of Universal Gravitation'],
        optionsTa: ['நேர்க்கோட்டு உந்த மாறாக் கோட்பாடு', 'பெர்னௌலி தத்துவம்', 'பாஸ்கல் விதி', 'அகில ஈர்ப்பு விதி'],
        correct: 0,
        explanation: 'Rocket propulsion is an application of Newton\'s third law and the conservation of linear momentum.',
        explanationTa: 'ராக்கெட் ஏவுதல் என்பது நியூட்டனின் மூன்றாம் விதி மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் செயல்படுகிறது.'
      },
      {
        question: 'Which of the following is the base SI unit of Luminous Intensity?',
        questionTa: 'ஒளிச்செறிவின் (Luminous Intensity) அடிப்படை SI அலகு எது?',
        options: ['Lumen', 'Candela', 'Lux', 'Watt'],
        optionsTa: ['லூமன் (Lumen)', 'கேண்டெலா (Candela)', 'லக்ஸ் (Lux)', 'வாட் (Watt)'],
        correct: 1,
        explanation: 'Candela (cd) is the base SI unit for measuring luminous intensity in a given direction.',
        explanationTa: 'ஒளிச்செறிவை அளவிடுவதற்கான அடிப்படை SI அலகு கேண்டெலா (cd) ஆகும்.'
      },
      {
        question: 'When a moving bus suddenly applies brakes, the passengers jerk forward due to which phenomenon?',
        questionTa: 'இயங்கிக் கொண்டிருக்கும் பேருந்து திடீரென நிறுத்தப்படும் போது, பயணிகள் முன்னோக்கி சாயக் காரணம் என்ன?',
        options: ['Inertia of Direction', 'Inertia of Rest', 'Inertia of Motion', 'Gravitational pull'],
        optionsTa: ['திசைக்கான நிலைமம்', 'ஓய்விற்கான நிலைமம்', 'இயக்கத்திற்கான நிலைமம்', 'புவியீர்ப்பு விசை'],
        correct: 2,
        explanation: 'The lower body comes to rest with the vehicle, but the upper body continues moving due to Inertia of Motion.',
        explanationTa: 'பேருந்து நின்றாலும் உடலின் மேற்பகுதி தொடர்ந்து இயக்கத்திலேயே இருக்க முயல்வதால் இயக்கத்திற்கான நிலைமம் காரணமாக பயணிகள் முன்னோக்கி சாய்கின்றனர்.'
      },
      {
        question: 'What is the dimensional formula for Force?',
        questionTa: 'விசையின் (Force) பரிமாண வாய்ப்பாடு என்ன?',
        options: ['[M L T⁻¹]', '[M L T⁻²]', '[M L² T⁻²]', '[M L⁻¹ T⁻²]'],
        optionsTa: ['[M L T⁻¹] (உந்தம்)', '[M L T⁻²] (விசை)', '[M L² T⁻²] (ஆற்றல்)', '[M L⁻¹ T⁻²] (அழுத்தம்)'],
        correct: 1,
        explanation: 'Force = Mass × Acceleration = [M] × [L T⁻²] = [M L T⁻²].',
        explanationTa: 'விசை = நிறை × முடுக்கம் = [M] × [L T⁻²] = [M L T⁻²].'
      }
    ]
  },
  polity: {
    summaryEn: `Indian Polity Chapter 1 traces the constitutional evolution from the Regulating Act of 1773 under the British East India Company to the landmark Government of India Act 1935 and Indian Independence Act 1947. It covers the creation of the Constituent Assembly in 1946, its committees, drafting, and adoption of the Constitution on 26 November 1949.`,
    summaryTa: `இந்திய அரசியலமைப்பு அத்தியாயம் 1: 1773 ஒழுங்குமுறைச் சட்டம் முதல் 1935 இந்திய அரசுச் சட்டம் வரையிலான வரலாற்றுப் பின்னணியையும், 1946-ல் அமைக்கப்பட்ட அரசியலமைப்பு நிர்ணய சபையின் செயல்பாடு மற்றும் டாக்டர் பி.ஆர். அம்பேத்கர் தலைமையிலான வரைவுக் குழுவின் பணியையும் விரிவாக விளக்குகிறது.`,
    keyPoints: [
      { title: '1. Regulating Act of 1773', desc: 'Designated the Governor of Bengal as the \'Governor-General of Bengal\' (Lord Warren Hastings). Established the Supreme Court at Calcutta (1774) with Sir Elijah Impey as Chief Justice.' },
      { title: '2. Charter Act of 1833', desc: 'Made the Governor-General of Bengal as the \'Governor-General of India\' (Lord William Bentinck). Completely ended commercial activities of the East India Company.' },
      { title: '3. Government of India Act 1858', desc: 'Enacted after the 1857 revolt; transferred rule to the British Crown. Created the office of Secretary of State for India and made the Governor-General the Viceroy (Lord Canning).' },
      { title: '4. Government of India Act 1935', desc: 'The most detailed and influential document for the Indian Constitution. Introduced Provincial Autonomy, abolished Dyarchy in provinces, and proposed an All-India Federation.' },
      { title: '5. Formation of Constituent Assembly (1946)', desc: 'Constituted under the Cabinet Mission Plan. First meeting held on 9 Dec 1946 with Dr. Sachchidananda Sinha as temporary president. Dr. Rajendra Prasad was elected permanent President on 11 Dec 1946.' },
      { title: '6. Drafting Committee & Adoption', desc: 'Drafting Committee setup on 29 August 1947 with Dr. B.R. Ambedkar as Chairman (7 members). The Constitution was adopted on 26 November 1949 and enacted on 26 January 1950 (Republic Day).' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Complete Indian Polity Chapter 1: Making of the Constitution & Historic Acts',
    pdfTitle: 'Agamakizh_Indian_Polity_Chapter1_Notes.pdf',
    quiz: [
      {
        question: 'Who first formally proposed the idea of a Constituent Assembly for India in 1934?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'M. N. Roy', 'Dr. B. R. Ambedkar'],
        correct: 2,
        explanation: 'M. N. Roy (pioneer of the communist movement in India) first mooted the idea of a Constituent Assembly for India in 1934.'
      },
      {
        question: 'Which British Act introduced bicameralism and direct elections in India for the first time?',
        options: ['Indian Councils Act 1909', 'Government of India Act 1919', 'Government of India Act 1935', 'Charter Act 1853'],
        correct: 1,
        explanation: 'The Government of India Act 1919 (Montagu-Chelmsford Reforms) introduced bicameralism and direct elections in the country for the first time.'
      },
      {
        question: 'Who was elected as the Permanent President of the Constituent Assembly on 11 December 1946?',
        options: ['Dr. Sachchidananda Sinha', 'Dr. Rajendra Prasad', 'H. C. Mukherjee', 'Dr. B. R. Ambedkar'],
        correct: 1,
        explanation: 'Dr. Rajendra Prasad was elected permanent President, while Dr. Sachchidananda Sinha was the temporary president in the first meeting on 9 Dec 1946.'
      },
      {
        question: 'Which committee of the Constituent Assembly was chaired by Dr. B. R. Ambedkar?',
        options: ['Union Powers Committee', 'Drafting Committee', 'Fundamental Rights Sub-Committee', 'Steering Committee'],
        correct: 1,
        explanation: 'Dr. B. R. Ambedkar was the Chairman of the 7-member Drafting Committee set up on 29 August 1947.'
      },
      {
        question: 'On which date was the Constitution of India formally adopted by the Constituent Assembly?',
        options: ['15 August 1947', '26 November 1949', '26 January 1950', '2 October 1948'],
        correct: 1,
        explanation: 'The Constitution was adopted on 26 November 1949 (celebrated as Constitution Day) and came into full legal effect on 26 January 1950.'
      }
    ]
  },
  history: {
    summaryEn: `Modern Indian History Chapter 1 details the arrival of European mercantile powers (Portuguese, Dutch, British, Danes, and French) in India, the strategic struggles for supremacy, the Carnatic Wars in South India, and the pivotal Battle of Plassey (1757) and Battle of Buxar (1764) that laid the foundation of British territorial dominion.`,
    summaryTa: `நவீன இந்திய வரலாறு அத்தியாயம் 1: 1498-ல் வாஸ்கோடகாமா வருகை முதல் ஐரோப்பிய வணிக நிறுவனங்களின் ஆதிக்கம், தென்னிந்தியாவில் நடைபெற்ற கர்நாடகப் போர்கள் மற்றும் 1757 பிளாசிப் போர், 1764 பக்சார் போர்கள் மூலம் பிரிட்டிஷ் கிழக்கிந்திய நிறுவனம் இந்தியாவில் காலூன்றிய வரலாற்றை விளக்குகிறது.`,
    keyPoints: [
      { title: '1. Portuguese Arrival (1498)', desc: 'Vasco da Gama reached Calicut in May 1498 and was welcomed by Zamorin. Francisco de Almeida introduced the Blue Water Policy; Alfonso de Albuquerque captured Goa in 1510.' },
      { title: '2. English East India Company (1600)', desc: 'Formed via royal charter by Queen Elizabeth I on 31 Dec 1600. Captain William Hawkins (1608) and Sir Thomas Roe (1615) visited Mughal Emperor Jahangir\'s court to secure trading rights.' },
      { title: '3. Fort St. George in Madras (1639)', desc: 'Francis Day obtained the lease of Madras from Chennappa Nayakar in 1639 and constructed Fort St. George, which became the headquarters of the Coromandel coast.' },
      { title: '4. The Carnatic Wars (1746 - 1763)', desc: 'Fought primarily in the Tamil Nadu region between the French (Dupleix) and the British (Robert Clive). The Treaty of Paris (1763) ended French political ambitions in India.' },
      { title: '5. Battle of Plassey (23 June 1757)', desc: 'Robert Clive defeated Siraj-ud-Daulah, the Nawab of Bengal, through the treachery of Mir Jafar. Marked the turning point from trading company to territorial master.' },
      { title: '6. Battle of Buxar (22 October 1764)', desc: 'Hector Munro defeated the joint forces of Mir Qasim (Bengal), Shuja-ud-Daulah (Awadh), and Mughal Emperor Shah Alam II. Led to the Treaty of Allahabad (1765) granting Diwani rights.' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Modern History Chapter 1: Advent of Europeans & British Dominance (TNPSC / UPSC Masterclass)',
    pdfTitle: 'Agamakizh_Modern_History_Chapter1_Notes.pdf',
    quiz: [
      {
        question: 'Who was the Portuguese governor who introduced the famous "Blue Water Policy"?',
        options: ['Alfonso de Albuquerque', 'Francisco de Almeida', 'Nuno da Cunha', 'Vasco da Gama'],
        correct: 1,
        explanation: 'Francisco de Almeida (first Viceroy of Portuguese India) initiated the Blue Water Policy (Cartaz system) to control maritime trade.'
      },
      {
        question: 'In which year did the British East India Company establish Fort St. George in Madras?',
        options: ['1600', '1639', '1668', '1700'],
        correct: 1,
        explanation: 'In 1639, Francis Day obtained land from the Raja of Chandragiri and built Fort St. George in Madras.'
      },
      {
        question: 'The decisive Battle of Plassey was fought on which historic date?',
        options: ['23 June 1757', '22 October 1764', '14 January 1761', '10 May 1857'],
        correct: 0,
        explanation: 'The Battle of Plassey took place on 23 June 1757 between Robert Clive and Siraj-ud-Daulah.'
      },
      {
        question: 'By which treaty did the British East India Company acquire the Diwani (revenue collecting) rights over Bengal, Bihar, and Orissa?',
        options: ['Treaty of Madras', 'Treaty of Paris', 'Treaty of Allahabad (1765)', 'Treaty of Purandar'],
        correct: 2,
        explanation: 'Following the victory at Buxar, Robert Clive signed the Treaty of Allahabad in August 1765 with Mughal Emperor Shah Alam II.'
      },
      {
        question: 'Which French Governor-General clashed fiercely with Robert Clive in the Carnatic Wars?',
        options: ['Dupleix', 'Count de Lally', 'Bussy', 'Colbert'],
        correct: 0,
        explanation: 'Joseph François Dupleix was the ambitious French Governor-General whose genius challenged British ascendancy in South India.'
      }
    ]
  },
  maths: {
    summaryEn: `Mathematics Chapter 1 covers foundational numerical agility: BODMAS simplification hierarchy, fractions and recurring decimals, prime numbers, comprehensive divisibility rules (2 through 11), algebraic expansion identities, and unit digit cyclicity calculation. These concepts form the bedrock of score-maximizing in TNPSC Group I/II/IV, SSC CGL/CHSL, and Railway RRB exams.`,
    summaryTa: `கணிதம் அத்தியாயம் 1: எண் முறைகளின் அடிப்படைகள், BODMAS செயலிகளின் முன்னுரிமை விதிகள், பின்னங்கள் மற்றும் தொடர் தசம எண்கள், பகா எண்கள், 2 முதல் 11 வரையிலான எண்களின் வகுபடும் தன்மை விதிகள், இயற்கணித முற்றொருமைகள் மற்றும் கடைசி இலக்கத்தைக் கணக்கிடும் நுணுக்கங்களை உள்ளடக்கியது. இது TNPSC, SSC மற்றும் ரயில்வே தேர்வுகளில் அதிக மதிப்பெண்களைப் பெற மிகவும் அவசியமான அடிப்படை அத்தியாயமாகும்.`,
    keyPoints: [
      {
        title: '1. BODMAS & VBODMAS Priority Rule',
        desc: 'Perform operations in strict order: V (Vinculum / Bar) -> B (Brackets: (), {}, []) -> O (Of / Orders) -> D (Division) -> M (Multiplication) -> A (Addition) -> S (Subtraction).',
        titleTa: '1. BODMAS & VBODMAS முன்னுரிமை விதி',
        descTa: 'செயல்பாடுகளின் வரிசை: V (கோட்டு அடைப்பு) -> B (அடைப்புக் குறிகள்) -> O (இல் / அடுக்குகள்) -> D (வகுத்தல்) -> M (பெருக்கல்) -> A (கூட்டல்) -> S (கழித்தல்).'
      },
      {
        title: '2. High-Yield Divisibility Tests',
        desc: 'Rule for 3 & 9: Sum of digits divisible by 3 or 9. Rule for 4 & 8: Last 2 or 3 digits divisible by 4 or 8. Rule for 11: Absolute difference of sum of alternate digits (odd places - even places) is 0 or multiple of 11.',
        titleTa: '2. வகுபடும் தன்மையின் முக்கிய விதிகள்',
        descTa: '3 மற்றும் 9-ன் விதி: இலக்கங்களின் கூடுதல் 3 அல்லது 9-ஆல் வகுபட வேண்டும். 4 மற்றும் 8-ன் விதி: கடைசி 2 அல்லது 3 இலக்கங்கள் வகுபட வேண்டும். 11-ன் விதி: ஒற்றை மற்றும் இரட்டை இட இலக்கங்களின் கூட்டுத்தொகை வித்தியாசம் 0 அல்லது 11-ன் மடங்காக இருக்க வேண்டும்.'
      },
      {
        title: '3. Key Algebraic Identities for Fast Simplification',
        desc: '(a+b)² = a² + 2ab + b²; (a-b)² = a² - 2ab + b²; a² - b² = (a+b)(a-b); a³ + b³ = (a+b)(a² - ab + b²); a³ - b³ = (a-b)(a² + ab + b²); If a+b+c = 0, then a³ + b³ + c³ = 3abc.',
        titleTa: '3. சுருக்குதலுக்கான முக்கிய இயற்கணித முற்றொருமைகள்',
        descTa: '(a+b)² = a² + 2ab + b²; (a-b)² = a² - 2ab + b²; a² - b² = (a+b)(a-b); a³ + b³ = (a+b)(a² - ab + b²); a+b+c = 0 எனில் a³ + b³ + c³ = 3abc.'
      },
      {
        title: '4. Unit Digit & Power Cyclicity',
        desc: 'Cyclicity of 2, 3, 7, 8 is 4 (divide exponent by 4 to get remainder); Cyclicity of 4 and 9 is 2 (odd/even powers); Digits 0, 1, 5, 6 always reproduce the same unit digit for any positive integer power.',
        titleTa: '4. கடைசி இலக்கம் மற்றும் சுழற்சி முறை',
        descTa: '2, 3, 7, 8 எண்களின் சுழற்சி 4 (அடுக்கை 4-ஆல் வகுத்து மீதியைக் கொண்டு கணக்கிடவும்); 4 மற்றும் 9 எண்களின் சுழற்சி 2; 0, 1, 5, 6 எண்களின் அடுக்கு எதுவாக இருந்தாலும் கடைசி இலக்கம் மாறாது.'
      },
      {
        title: '5. Natural Number Summation Formulas',
        desc: 'Sum of first n natural numbers = n(n+1)/2; Sum of first n odd numbers = n²; Sum of first n even numbers = n(n+1); Sum of squares = n(n+1)(2n+1)/6; Sum of cubes = [n(n+1)/2]².',
        titleTa: '5. இயல் எண்களின் கூடுதல் வாய்ப்பாடுகள்',
        descTa: 'முதல் n இயல் எண்களின் கூடுதல் = n(n+1)/2; முதல் n ஒற்றைப்படை எண்களின் கூடுதல் = n²; வர்க்கங்களின் கூடுதல் = n(n+1)(2n+1)/6; கனங்களின் கூடுதல் = [n(n+1)/2]².'
      }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'TNPSC & SSC Maths Chapter 1: Simplification, BODMAS & Number System Shortcuts',
    pdfTitle: 'Agamakizh_Maths_Chapter1_Simplification_Formulas.pdf',
    quiz: [
      {
        question: 'Evaluate the expression: 24 ÷ 6 × (3 + 1) - 10',
        questionTa: 'மதிப்பு காண்க: 24 ÷ 6 × (3 + 1) - 10',
        options: ['6', '10', '4', '16'],
        optionsTa: ['6', '10', '4', '16'],
        correct: 0,
        explanation: 'According to BODMAS: 24 ÷ 6 × (4) - 10 = 4 × 4 - 10 = 16 - 10 = 6.',
        explanationTa: 'BODMAS விதிப்படி: அடைப்புக்குறி (3 + 1) = 4; வகுத்தல் 24 ÷ 6 = 4; பெருக்கல் 4 × 4 = 16; கழித்தல் 16 - 10 = 6.'
      },
      {
        question: 'If the seven-digit number 5432*71 is completely divisible by 9, what is the single digit in place of *?',
        questionTa: '5432*71 என்ற 7 இலக்க எண் 9-ஆல் முழுமையாக வகுபடும் எனில், * என்ற இடத்தில் வரவேண்டிய எண் எது?',
        options: ['3', '5', '4', '6'],
        optionsTa: ['3', '5', '4', '6'],
        correct: 1,
        explanation: 'Sum of digits = 5 + 4 + 3 + 2 + * + 7 + 1 = 22 + *. The nearest multiple of 9 greater than 22 is 27. So, * = 27 - 22 = 5.',
        explanationTa: 'இலக்கங்களின் கூடுதல் = 5 + 4 + 3 + 2 + * + 7 + 1 = 22 + *. 22-க்கு அடுத்த 9-ன் மடங்கு 27 ஆகும். எனவே * = 27 - 22 = 5.'
      },
      {
        question: 'Find the simplified value of: (675 × 675 × 675 + 325 × 325 × 325) / (675 × 675 - 675 × 325 + 325 × 325)',
        questionTa: 'மதிப்பு காண்க: (675 × 675 × 675 + 325 × 325 × 325) / (675 × 675 - 675 × 325 + 325 × 325)',
        options: ['350', '1000', '500', '1350'],
        optionsTa: ['350', '1000', '500', '1350'],
        correct: 1,
        explanation: 'The expression is in the standard identity form (a³ + b³) / (a² - ab + b²) = a + b. Here a = 675 and b = 325. Thus, 675 + 325 = 1000.',
        explanationTa: 'இது (a³ + b³) / (a² - ab + b²) = a + b என்ற முற்றொருமை வடிவம். இங்கு a = 675 மற்றும் b = 325. எனவே 675 + 325 = 1000.'
      },
      {
        question: 'What is the unit digit in the product (7⁷¹ × 6⁶³ × 3⁶⁵)?',
        questionTa: '(7⁷¹ × 6⁶³ × 3⁶⁵) என்ற பெருக்கற்பலனின் கடைசி இலக்கம் (Unit Digit) என்ன?',
        options: ['1', '2', '4', '6'],
        optionsTa: ['1', '2', '4', '6'],
        correct: 2,
        explanation: 'Cyclicity: 71 mod 4 = 3 -> 7³ ends in 3. Any power of 6 ends in 6. 65 mod 4 = 1 -> 3¹ ends in 3. Unit digit of product = (3 × 6 × 3) = 54 -> ends in 4.',
        explanationTa: 'சுழற்சி விதி: 71 ÷ 4 மீதி 3, 7³-ன் கடைசி எண் 3. 6-ன் அடுக்கு எதுவாக இருந்தாலும் கடைசி எண் 6. 65 ÷ 4 மீதி 1, 3¹-ன் கடைசி எண் 3. பெருக்கற்பலன் = 3 × 6 × 3 = 54, எனவே கடைசி இலக்கம் 4.'
      },
      {
        question: 'What is the sum of the first 40 positive natural numbers (1 + 2 + 3 + ... + 40)?',
        questionTa: 'முதல் 40 இயல் எண்களின் கூடுதல் (1 + 2 + 3 + ... + 40) என்ன?',
        options: ['800', '820', '840', '860'],
        optionsTa: ['800', '820', '840', '860'],
        correct: 1,
        explanation: 'Sum = n(n + 1) / 2 = 40 × 41 / 2 = 20 × 41 = 820.',
        explanationTa: 'சூத்திரம்: n(n + 1) / 2 = 40 × 41 / 2 = 20 × 41 = 820.'
      }
    ]
  },
  reasoning: {
    summaryEn: `General Intelligence & Reasoning Chapter 1 covers Coding-Decoding and Letter Series foundations. Aspirants learn the alphabetical positional indices (1 to 26), reverse positions (27 - forward position), opposite letter pairs, letter shift patterns (+1, -2, alternating), number-symbol codes, and fictitious language message deciphering.`,
    summaryTa: `காரணவியல் அத்தியாயம் 1: குறியீட்டு முறைகள் (Coding-Decoding) மற்றும் எழுத்துத் தொடர்களின் அடிப்படைகளை விளக்குகிறது. ஆங்கில எழுத்துகளின் நேரடி மற்றும் எதிர்த்திசை இடமதிப்புகள், எதிர் எழுத்து ஜோடிகள், எழுத்து இடப்பெயர்ச்சி முறைகள் மற்றும் பொதுவான குறியீடுகளைக் கண்டறியும் குறுக்குவழிகள் இதில் அடங்கும்.`,
    keyPoints: [
      {
        title: '1. Alphabet Positional Values & The EJOTY Rule',
        desc: 'Memorize benchmark letter positions using EJOTY: E=5, J=10, O=15, T=20, Y=25. Reverse alphabetical position formula: Reverse Position = 27 - Forward Position.',
        titleTa: '1. எழுத்துகளின் இடமதிப்பு & EJOTY விதி',
        descTa: 'எழுத்துகளின் நிலையை எளிதில் நினைவில் கொள்ள EJOTY உதவுகிறது: E=5, J=10, O=15, T=20, Y=25. எதிர்திசை எண் = 27 - நேரடி எண்.'
      },
      {
        title: '2. Opposite Letter Pairs (Sum equals 27)',
        desc: 'Pairs whose numerical positions sum to 27: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N. Memorize with mnemonics like BYE, DEW, HIGH SCHOOL, INDIAN RAILWAY.',
        titleTa: '2. எதிர் எழுத்து ஜோடிகள் (கூடுதல் 27)',
        descTa: 'கூட்டுத்தொகை 27 வரும் எதிர் எழுத்து ஜோடிகள்: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N.'
      },
      {
        title: '3. Forward & Backward Shift Patterns',
        desc: 'Letters are transformed by adding or subtracting constant or incremental values: e.g., +1, +2, +3... or alternating +2, -2. Cross-shifting (first letter to last) is also common in competitive exams.',
        titleTa: '3. நேரடி மற்றும் மாற்று இடப்பெயர்ச்சி விதிகள்',
        descTa: 'எழுத்துகள் ஒரு குறிப்பிட்ட எண் அளவுக்கு முன்னே அல்லது பின்னே மாற்றப்படும் (எ.கா: +1, +2, +3... அல்லது +2, -2).'
      },
      {
        title: '4. Number & Symbol Coding Logic',
        desc: 'Words are represented by numbers corresponding to the sum of positional values of vowels/consonants, letter counts, or squares/cubes of word length.',
        titleTa: '4. எண் மற்றும் குறியீட்டு முறைகள்',
        descTa: 'சொற்கள் அவற்றின் எழுத்துகளின் இடமதிப்பு கூடுதல் அல்லது எழுத்துகளின் எண்ணிக்கையின் அடிப்படையில் எண்களாகக் குறியிடப்படுகின்றன.'
      },
      {
        title: '5. Deciphering Message (Fictitious Language)',
        desc: 'Comparing 2 or 3 sentences with common words to isolate individual codes through step-by-step elimination. Fast and guaranteed marks in competitive tests.',
        titleTa: '5. வாக்கியக் குறியீடுகளைப் பிரித்தறிதல்',
        descTa: 'இரண்டு அல்லது அதற்கு மேற்பட்ட வாக்கியங்களில் உள்ள பொதுவான சொற்களை ஒப்பிட்டு, தனித்தனி குறியீடுகளைக் கண்டறியும் முறை.'
      }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Reasoning Chapter 1: Coding-Decoding Mastery & Speed Tricks for TNPSC / SSC / RRB',
    pdfTitle: 'Agamakizh_Reasoning_Chapter1_Coding_Decoding.pdf',
    quiz: [
      {
        question: 'If in a code language MADRAS is written as NBESBT, how is BOMBAY written in that code?',
        questionTa: 'ஒரு குறிப்பிட்ட குறியீட்டு மொழியில் MADRAS என்பது NBESBT என எழுதப்பட்டால், BOMBAY என்பது எவ்வாறு எழுதப்படும்?',
        options: ['CPNCBZ', 'CPNCBX', 'CPOCBZ', 'CQOCBZ'],
        optionsTa: ['CPNCBZ', 'CPNCBX', 'CPOCBZ', 'CQOCBZ'],
        correct: 0,
        explanation: 'Each letter is shifted forward by +1: M->N, A->B, D->E, R->S, A->B, S->T. Similarly, B->C, O->P, M->N, B->C, A->B, Y->Z = CPNCBZ.',
        explanationTa: 'ஒவ்வொரு எழுத்தும் +1 என்ற அளவில் முன்னே நகர்த்தப்பட்டுள்ளது: M->N, A->B, D->E... எனவே BOMBAY என்பது CPNCBZ ஆகும்.'
      },
      {
        question: 'If A = 1 and CAT = 24, then what is the value of POLICE?',
        questionTa: 'A = 1, CAT = 24 (3+1+20) எனில், POLICE என்பதன் மதிப்பு என்ன?',
        options: ['60', '63', '58', '65'],
        optionsTa: ['60', '63', '58', '65'],
        correct: 0,
        explanation: 'Sum of alphabetical positions: P(16) + O(15) + L(12) + I(9) + C(3) + E(5) = 60.',
        explanationTa: 'எழுத்துகளின் இடமதிப்புகளின் கூடுதல்: P(16) + O(15) + L(12) + I(9) + C(3) + E(5) = 60.'
      },
      {
        question: 'In a code language: "256" means "red color chalk", "589" means "green color flower", and "245" means "white color chalk". Which digit represents "white"?',
        questionTa: 'ஒரு குறியீட்டு மொழியில்: "256" என்பது "red color chalk", "589" என்பது "green color flower", மற்றும் "245" என்பது "white color chalk" எனக் குறிக்கப்பட்டால், "white" என்பதைக் குறிக்கும் எண் எது?',
        options: ['2', '4', '5', '6'],
        optionsTa: ['2', '4', '5', '6'],
        correct: 1,
        explanation: 'In "256" and "245", common words are "color" and "chalk", and common digits are 2 and 5. Therefore, the remaining word in "245" is "white" and the remaining digit is 4.',
        explanationTa: '"256" மற்றும் "245" இரண்டிலும் "color", "chalk" பொதுவானவை; எண்கள் 2, 5 பொதுவானவை. எனவே "245"-ல் மீதமுள்ள "white" என்பதன் எண் 4 ஆகும்.'
      },
      {
        question: 'If each letter of the word ROAD is replaced by its opposite letter in the alphabet, it becomes ILZW. In the same way, how will KING be coded?',
        questionTa: 'ROAD என்ற சொல்லின் ஒவ்வொரு எழுத்தும் ஆங்கில அகரவரிசையின் எதிர் எழுத்தாக மாற்றப்பட்டு ILZW என எழுதப்பட்டால், KING என்பது எவ்வாறு எழுதப்படும்?',
        options: ['PRMT', 'PRNT', 'PQMT', 'PSTT'],
        optionsTa: ['PRMT', 'PRNT', 'PQMT', 'PSTT'],
        correct: 0,
        explanation: 'Opposite letters (sum = 27): K <-> P, I <-> R, N <-> M, G <-> T. Hence, KING = PRMT.',
        explanationTa: 'எதிர் எழுத்துகள் (கூடுதல் 27): K-க்கு P, I-க்கு R, N-க்கு M, G-க்கு T. எனவே KING என்பது PRMT.'
      },
      {
        question: 'Find the missing term in the alphanumeric series: B2D, E4H, H8L, K16P, ?',
        questionTa: 'விடுபட்ட தொடரைக் கண்டறிக: B2D, E4H, H8L, K16P, ?',
        options: ['N32T', 'M32T', 'N24T', 'O32S'],
        optionsTa: ['N32T', 'M32T', 'N24T', 'O32S'],
        correct: 0,
        explanation: 'First letters (+3): B, E, H, K, N. Numbers (×2): 2, 4, 8, 16, 32. Last letters (+4): D, H, L, P, T. So the next term is N32T.',
        explanationTa: 'முதல் எழுத்து (+3): B, E, H, K, N. எண்கள் (×2): 2, 4, 8, 16, 32. இறுதி எழுத்து (+4): D, H, L, P, T. எனவே அடுத்த உறுப்பு N32T.'
      }
    ]
  }
};

const scienceTamilDictionary: Record<string, string> = {
  // Scientific Concepts & Laws
  'Conservation of Linear Momentum': 'நேர்க்கோட்டு உந்த மாறாக் கோட்பாடு',
  "Bernoulli's Principle": 'பெர்னௌலி தத்துவம்',
  "Pascal's Law": 'பாஸ்கல் விதி',
  'Law of Universal Gravitation': 'அகில ஈர்ப்பு விதி',
  'Lumen': 'லூமன் (Lumen)',
  'Candela': 'கேண்டெலா (Candela)',
  'Lux': 'லக்ஸ் (Lux)',
  'Watt': 'வாட் (Watt)',
  'Inertia of Direction': 'திசைக்கான நிலைமம்',
  'Inertia of Rest': 'ஓய்விற்கான நிலைமம்',
  'Inertia of Motion': 'இயக்கத்திற்கான நிலைமம்',
  'Gravitational pull': 'புவியீர்ப்பு விசை',
  'Velocity': 'திசைவேகம்',
  'Acceleration': 'முடுக்கம்',
  'Work': 'வேலை',
  'Linear Momentum': 'நேர்க்கோட்டு உந்தம்',
  '[M L T⁻¹]': '[M L T⁻¹] (உந்தம்)',
  '[M L T⁻²]': '[M L T⁻²] (விசை)',
  '[M L² T⁻²]': '[M L² T⁻²] (ஆற்றல்)',
  '[M L⁻¹ T⁻²]': '[M L⁻¹ T⁻²] (அழுத்தம்)',

  // Astronomical Unit Question & Options
  'What is the average distance represented by one Astronomical Unit (AU), commonly used to measure distances within our solar system?': 'சூரியக் குடும்பத்திற்குள் உள்ள தொலைவுகளை அளவிடப் பயன்படும் ஒரு வானியல் அலகு (AU) குறிக்கும் சராசரி தொலைவு என்ன?',
  '1.496 × 10¹¹ m (149.6 Million km)': '1.496 × 10¹¹ மீ (149.6 மில்லியன் கி.மீ)',
  '9.46 × 10¹⁵ m (Light Year)': '9.46 × 10¹⁵ மீ (ஒளி ஆண்டு)',
  '3.08 × 10¹⁶ m (Parsec)': '3.08 × 10¹⁶ மீ (விண்ணியல் ஆரம்)',
  '3 × 10⁸ m/s (Speed of Light)': '3 × 10⁸ மீ/வி (ஒளியின் வேகம்)',
  '1 Astronomical Unit (AU) is the mean distance between the Earth and the Sun, equal to 1.496 × 10¹¹ meters.': '1 வானியல் அலகு (AU) என்பது பூமிக்கும் சூரியனுக்கும் இடைப்பட்ட சராசரி தொலைவு ஆகும். இதன் மதிப்பு 1.496 × 10¹¹ மீட்டர்கள் (சுமார் 149.6 மில்லியன் கி.மீ).',

  // Rocket Propulsion Question & Explanations
  'Rocket propulsion is an application of which fundamental physical law?': 'ராக்கெட் ஏவுதல் எந்த அடிப்படை இயற்பியல் விதியின் பயன்பாடாகும்?',
  'Rocket propulsion functions strictly on which fundamental physical principle?': 'ராக்கெட் ஏவுதல் எந்த அடிப்படை இயற்பியல் விதியின் அடிப்படையில் செயல்படுகிறது?',
  'Rocket propulsion is an application of Newton\'s third law and the conservation of linear momentum.': 'ராக்கெட் ஏவுதல் என்பது நியூட்டனின் மூன்றாம் விதி மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் செயல்படுகிறது.',
  'Rocket propulsion functions on Newton\'s third law and the conservation of linear momentum.': 'ராக்கெட் ஏவுதல் என்பது நியூட்டனின் மூன்றாம் விதி மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் செயல்படுகிறது.',

  // Luminous Intensity Question & Explanations
  'Which of the following is the SI unit of Luminous Intensity?': 'ஒளிச்செறிவின் அடிப்படை SI அலகு எது?',
  'Which of the following is the base SI unit of Luminous Intensity?': 'ஒளிச்செறிவின் (Luminous Intensity) அடிப்படை SI அலகு எது?',
  'Candela (cd) is the base SI unit for measuring luminous intensity in a given direction.': 'ஒரு குறிப்பிட்ட திசையில் ஒளிச்செறிவை அளவிடுவதற்கான அடிப்படை SI அலகு கேண்டெலா (cd) ஆகும்.',
  'Candela (cd) is the base SI unit for measuring luminous intensity.': 'ஒளிச்செறிவை அளவிடுவதற்கான அடிப்படை SI அலகு கேண்டெலா (cd) ஆகும்.',

  // Moving Bus & Inertia Question & Explanations
  'When a moving bus suddenly applies brakes, the passengers jerk forward due to which phenomenon?': 'இயங்கிக் கொண்டிருக்கும் பேருந்து திடீரென நிறுத்தப்படும் போது, பயணிகள் முன்னோக்கி சாயக் காரணம் என்ன?',
  'The lower body comes to rest with the vehicle, but the upper body continues moving due to Inertia of Motion.': 'பேருந்து நின்றாலும் உடலின் மேற்பகுதி தொடர்ந்து இயக்கத்திலேயே இருக்க முயல்வதால் இயக்கத்திற்கான நிலைமம் காரணமாக பயணிகள் முன்னோக்கி சாய்கின்றனர்.',

  // Force Dimensional Formula Question & Explanations
  'What is the dimensional formula for Force?': 'விசையின் (Force) பரிமாண வாய்ப்பாடு என்ன?',
  'Force = Mass × Acceleration = [M] × [L T⁻²] = [M L T⁻²].': 'விசை = நிறை × முடுக்கம் = [M] × [L T⁻²] = [M L T⁻²].',

  // History & Polity questions
  'Who was the Portuguese governor who introduced the famous "Blue Water Policy"?': 'புகழ்பெற்ற "நீல நிறக் கொள்கை" (Blue Water Policy) அறிமுகப்படுத்திய போர்த்துகீசிய ஆளுநர் யார்?',
  'In which year did the British East India Company establish Fort St. George in Madras?': 'பிரிட்டிஷ் கிழந்திய நிறுவனம் மதராஸில் புனித ஜார்ஜ் கோட்டையை எந்த ஆண்டு கட்டியது?',
  'The decisive Battle of Plassey was fought on which historic date?': 'வரலாற்று சிறப்புமிக்க பிளாசிப் போர் நடைபெற்ற நாள் எது?',
  'By which treaty did the British East India Company acquire the Diwani (revenue collecting) rights over Bengal, Bihar, and Orissa?': 'எந்த ஒப்பந்தத்தின் மூலம் பிரிட்டிஷ் கிழந்திய நிறுவனம் வங்காளம், பீகார் மற்றும் ஒடிசா மீது திவானி உரிமைகளைப் பெற்றது?',
  'Which French Governor-General clashed fiercely with Robert Clive in the Carnatic Wars?': 'கர்நாடகப் போர்களில் ராபர்ட் கிளைவுடன் தீவிரமாக மோதிய பிரெஞ்சு கவர்னர்-ஜெனரல் யார்?',
  'Who first formally proposed the idea of a Constituent Assembly for India in 1934?': '1934-ல் இந்தியாவிற்கு அரசியலமைப்பு நிர்ணய சபை வேண்டும் என்ற கருத்தை முதலில் முன்மொழிந்தவர் யார்?',
  'Which British Act introduced bicameralism and direct elections in India for the first time?': 'இந்தியாவில் முதல்முறையாக ஈரவை சட்டமன்றம் மற்றும் நேரடித் தேர்தலை அறிமுகப்படுத்திய ஆங்கிலேய சட்டம் எது?',
  'Who was elected as the Permanent President of the Constituent Assembly on 11 December 1946?': 'டிசம்பர் 11, 1946 அன்று அரசியலமைப்பு நிர்ணய சபையின் நிரந்தரத் தலைவராகத் தேர்ந்தெடுக்கப்பட்டவர் யார்?'
};

function getDisplayQuestion(q: any, lang: 'english' | 'tamil'): { question: string; options: string[]; explanation?: string } {
  if (lang === 'english') {
    return {
      question: q.question,
      options: q.options || [],
      explanation: q.explanation
    };
  }

  const translatedQ = q.questionTa || scienceTamilDictionary[q.question] || q.question;
  const translatedOpts = q.optionsTa && q.optionsTa.length === 4 
    ? q.optionsTa 
    : (q.options || []).map((opt: string) => scienceTamilDictionary[opt] || opt);
  const translatedExp = q.explanationTa || scienceTamilDictionary[q.explanation || ''] || q.explanation;

  return {
    question: translatedQ,
    options: translatedOpts,
    explanation: translatedExp
  };
}

export default function SubjectChapterView({
  subject,
  examName,
  language,
  onLanguageChange,
  initialChapter = null,
  onBack,
  onOpenPdf
}: SubjectChapterViewProps) {
  const [activeLanguage, setActiveLanguage] = useState<'english' | 'tamil'>(() => {
    return (localStorage.getItem('agamakizh_study_medium') as 'english' | 'tamil') || language || 'english';
  });

  const toggleLanguage = (lang: 'english' | 'tamil') => {
    setActiveLanguage(lang);
    localStorage.setItem('agamakizh_study_medium', lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  useEffect(() => {
    if (language && language !== activeLanguage) {
      setActiveLanguage(language);
    }
  }, [language]);

  const chapters = getSubjectChapters(subject.id, subject.name);
  const [currentChapter, setCurrentChapter] = useState<number | null>(initialChapter);
  const [activeTab, setActiveTab] = useState<'notes' | 'video' | 'quiz' | 'pdf'>('notes');
  const [completedChapters, setCompletedChapters] = useState<number[]>([1]);
  
  // Quiz state for Chapter 1
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Active chapter details
  const chapterDetails = chapters.find(c => c.number === currentChapter);

  // Check for Admin Custom Chapter Module with reactive state
  const [customModules, setCustomModules] = useState<Record<string, any>>(() => {
    return JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
  });

  const [resolvedPdfData, setResolvedPdfData] = useState<{ url: string; isBlob: boolean } | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');

  const specificExamKey = `${examName}_${subject.id}_ch_${currentChapter}`;
  const customChapterKey = `${subject.id}_ch_${currentChapter}`;
  const customContent = customModules[specificExamKey] || customModules[customChapterKey];

  // Sync listener across tabs and window events
  useEffect(() => {
    const handleSync = () => {
      try {
        const local = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
        setCustomModules(local);
      } catch (e) {
        console.warn('Sync failed:', e);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('agamakizh_chapter_updated', handleSync);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('agamakizh_channel');
      bc.onmessage = (msg) => {
        if (msg.data?.type === 'CHAPTER_UPDATED') {
          handleSync();
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('agamakizh_chapter_updated', handleSync);
      if (bc) bc.close();
    };
  }, []);

  // Resolve PDF URL from memory or IndexedDB
  useEffect(() => {
    let isCancelled = false;
    async function resolvePdf() {
      if (!customContent) {
        setResolvedPdfData(null);
        return;
      }
      if (customContent.pdfUrl && customContent.pdfUrl.startsWith('data:')) {
        setResolvedPdfData({ url: customContent.pdfUrl, isBlob: false });
        return;
      }
      if (customContent._pdfUrl_indexedDbKey) {
        setIsPdfLoading(true);
        try {
          const blobData = await getBlob(customContent._pdfUrl_indexedDbKey);
          if (!isCancelled && blobData) {
            setResolvedPdfData({ url: blobData, isBlob: false });
          }
        } finally {
          if (!isCancelled) setIsPdfLoading(false);
        }
      }
    }
    resolvePdf();
    return () => {
      isCancelled = true;
    };
  }, [customContent]);

  const handleManualPdfSync = async () => {
    setIsPdfLoading(true);
    try {
      const local = JSON.parse(localStorage.getItem('agamakizh_chapter_modules') || '{}');
      setCustomModules(local);
      const curr = local[specificExamKey] || local[customChapterKey];
      if (curr?._pdfUrl_indexedDbKey) {
        const blobData = await getBlob(curr._pdfUrl_indexedDbKey);
        if (blobData) {
          setResolvedPdfData({ url: blobData, isBlob: false });
        }
      }
      setSyncFeedback('PDF Synced!');
      setTimeout(() => setSyncFeedback(''), 2500);
    } catch {
      setSyncFeedback('Refreshed!');
      setTimeout(() => setSyncFeedback(''), 2000);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const defaultContent = currentChapter === 1 
    ? (chapterOneContents[subject.id] || chapterOneContents.physics) 
    : null;

  const fallbackContent = {
    summaryEn: `Complete comprehensive concepts, analytical breakdown, and key examination points for ${subject.name} - Chapter ${currentChapter}.`,
    summaryTa: `${subject.name} - அத்தியாயம் ${currentChapter} குறித்த விரிவான பாடக் குறிப்புகள் மற்றும் மாதிரி வினாக்கள்.`,
    keyPoints: [
      { title: `1. Core Principles of Chapter ${currentChapter}`, desc: `Fundamental definitions, concepts, and analytical framework for ${subject.name}.` },
      { title: `2. High-Yield Exam Trends`, desc: `Past year question paper patterns and high-probability topics for upcoming exams.` },
      { title: `3. Revision Summary & Formulae`, desc: `Quick review points and key takeaways for rapid revision.` }
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kY73_5Vq-uU',
    videoTitle: `${subject.name} - Chapter ${currentChapter} Video Class`,
    pdfTitle: `${subject.name}_Chapter${currentChapter}_Notes.pdf`,
    pdfUrl: '',
    quiz: [
      {
        question: `Which fundamental principle is central to ${subject.name} Chapter ${currentChapter}?`,
        options: ['Core Theoretical Concept', 'Applied Problem Solving', 'Both A and B', 'None of the above'],
        correct: 2,
        explanation: `Both core concepts and applied problem solving are essential to master ${subject.name} Chapter ${currentChapter}.`
      }
    ]
  };

  const baseContent = customContent || defaultContent || fallbackContent;
  const detailedContent = {
    ...baseContent,
    pdfUrl: resolvedPdfData?.url || customContent?.pdfUrl || baseContent.pdfUrl || ''
  };

  const handleStartChapter = (chNum: number) => {
    setCurrentChapter(chNum);
    setActiveTab('notes');
    setSelectedAnswers({});
    setShowQuizResults(false);
  };

  const toggleChapterCompletion = (chNum: number) => {
    setCompletedChapters(prev => 
      prev.includes(chNum) ? prev.filter(c => c !== chNum) : [...prev, chNum]
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button 
            onClick={onBack}
            className="hover:text-slate-900 transition-colors flex items-center gap-1 font-bold text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{examName}</span>
          </button>
          <span>/</span>
          <span className="text-blue-600 font-bold">{subject.name}</span>
          {currentChapter !== null && (
            <>
              <span>/</span>
              <span className="text-slate-900 font-black">Chapter {currentChapter}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* English / Tamil Medium Switcher */}
          <div className="flex items-center p-1 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <button
              onClick={() => toggleLanguage('english')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLanguage === 'english'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>🇬🇧</span>
              <span>English Medium</span>
            </button>
            <button
              onClick={() => toggleLanguage('tamil')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeLanguage === 'tamil'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>🇮🇳</span>
              <span>தமிழ் வழி (Tamil)</span>
            </button>
          </div>

          {currentChapter !== null && (
            <button
              onClick={() => setCurrentChapter(null)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All 12 Chapters</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW A: CHAPTER 1 DEEP LEARNING PORTAL */}
      {currentChapter !== null ? (
        <div className="space-y-8">
          {/* Chapter Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                  Chapter {currentChapter} of 12
                </span>
                <span className="px-3 py-1 bg-white/10 text-slate-300 text-[11px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-md">
                  {subject.name}
                </span>
                {completedChapters.includes(currentChapter) && (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1">
                    <Check className="h-3 w-3" /> Completed
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                {activeLanguage === 'tamil' ? chapterDetails?.titleTa : chapterDetails?.titleEn}
              </h1>
              
              <p className="text-slate-300 text-sm leading-relaxed">
                {activeLanguage === 'tamil' ? chapterDetails?.descriptionTa : chapterDetails?.descriptionEn}
              </p>

              <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>{chapterDetails?.duration || '45 mins'} read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Exam Weightage: High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Portal Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>{activeLanguage === 'tamil' ? 'பாடக் குறிப்புகள் (Notes)' : 'Study Notes & Key Concepts'}</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>{activeLanguage === 'tamil' ? 'வீடியோ வகுப்பு (Video)' : 'Video Lecture Class'}</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>
                {activeLanguage === 'tamil' 
                  ? `மாதிரித் தேர்வு (${detailedContent?.quiz.length || 5} வினாக்கள்)` 
                  : `Practice Test (${detailedContent?.quiz.length || 5} MCQs)`}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{activeLanguage === 'tamil' ? 'PDF பாடப் புத்தகம் (PDF)' : 'PDF Materials'}</span>
            </button>
          </div>

          {/* TAB 1: STUDY NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    <span>{activeLanguage === 'tamil' ? 'அத்தியாயத்தின் முக்கியச் சுருக்கம்' : 'Chapter Executive Summary'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
                    {activeLanguage === 'tamil' ? '🇮🇳 தமிழ் வழிப் பாடம்' : '🇬🇧 English Medium'}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {activeLanguage === 'tamil' ? (detailedContent?.summaryTa || detailedContent?.summaryEn) : detailedContent?.summaryEn}
                </p>
              </div>

              {/* Core Concept Breakdown */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>{activeLanguage === 'tamil' ? 'முக்கியக் குறிப்புகள் & தேர்வு பகுப்பாய்வு' : 'Key Topics & Exam Takeaways'}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedContent?.keyPoints.map((point: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-2 group"
                    >
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {activeLanguage === 'tamil' && point.titleTa ? point.titleTa : point.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeLanguage === 'tamil' && point.descTa ? point.descTa : point.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO LECTURE */}
          {activeTab === 'video' && (() => {
            const videoInfo = formatVideoEmbed(detailedContent?.videoUrl);
            return (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1 max-w-xl">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Play className="h-4 w-4 text-rose-600 fill-rose-600 shrink-0" />
                      <span>{detailedContent?.videoTitle || `${subject.name} - Chapter ${currentChapter} Video Class`}</span>
                    </h3>
                    <p className="text-xs text-slate-500">High definition video explanation with past exam questions.</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={videoInfo.directWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs group"
                    >
                      <ExternalLink className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                      <span>Watch on YouTube</span>
                    </a>
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-3 py-1 rounded-full uppercase tracking-wider">
                      HD Lecture
                    </span>
                  </div>
                </div>

                {/* Responsive Video Player */}
                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800">
                  <iframe 
                    src={videoInfo.embedUrl}
                    title={detailedContent?.videoTitle || "Chapter Video Class"}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>

                {/* Direct Link & Help Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Video player showing a sad face or restricted? Click to open directly in YouTube with no restrictions.</span>
                  </div>
                  <a
                    href={videoInfo.directWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    Open Directly in YouTube <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })()}

          {/* TAB 3: PRACTICE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <span>
                      {activeLanguage === 'tamil' 
                        ? `அத்தியாயம் ${currentChapter} மாதிரித் தேர்வு` 
                        : `Chapter ${currentChapter} Assessment Test`}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeLanguage === 'tamil' 
                      ? `${detailedContent?.quiz.length || 5} கொள்குறி வினாக்கள் (உடனடி விடைகளுடன்)` 
                      : `${detailedContent?.quiz.length || 5} Multiple Choice Questions with Instant Feedback`}
                  </p>
                </div>
                
                <div className="flex items-center flex-wrap gap-3">
                  {/* Inline Language Switcher inside Quiz Card */}
                  <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => toggleLanguage('english')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLanguage === 'english'
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLanguage('tamil')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLanguage === 'tamil'
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🇮🇳 தமிழ் வழி
                    </button>
                  </div>

                  {showQuizResults && (
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                      {activeLanguage === 'tamil' ? 'மதிப்பெண்: ' : 'Score: '} 
                      {Object.entries(selectedAnswers).filter(([qIdx, ans]) => detailedContent?.quiz[Number(qIdx)]?.correct === ans).length} / {detailedContent?.quiz.length || 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {detailedContent?.quiz.map((rawQ: any, qIdx: number) => {
                  const q = getDisplayQuestion(rawQ, activeLanguage);

                  return (
                    <div key={qIdx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">
                          <span className="text-blue-600 mr-2 font-black">Q{qIdx + 1}.</span>
                          {q.question}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600 shrink-0">
                          {activeLanguage === 'tamil' ? '1 மதிப்பெண்' : '1 Mark'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          const isCorrect = rawQ.correct === optIdx;
                          let optionStyles = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';

                          if (showQuizResults) {
                            if (isCorrect) {
                              optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs';
                            } else if (isSelected && !isCorrect) {
                              optionStyles = 'bg-red-50 border-red-500 text-red-800 font-bold shadow-xs';
                            }
                          } else if (isSelected) {
                            optionStyles = 'bg-blue-50 border-blue-600 text-blue-700 font-bold ring-2 ring-blue-500/20';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => !showQuizResults && setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                              disabled={showQuizResults}
                              className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${optionStyles}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {showQuizResults && isCorrect && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizResults && q.explanation && (
                        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 leading-relaxed">
                          <span className="font-bold text-blue-950 mr-1.5">
                            {activeLanguage === 'tamil' ? '💡 விளக்கம் (Explanation):' : '💡 Explanation:'}
                          </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  {activeLanguage === 'tamil' 
                    ? `விடைகள் தேர்ந்தெடுக்கப்பட்டது: ${Object.keys(selectedAnswers).length} / ${detailedContent?.quiz.length || 5}` 
                    : `Questions Answered: ${Object.keys(selectedAnswers).length} / ${detailedContent?.quiz.length || 5}`}
                </span>

                <div className="flex items-center gap-3">
                  {showQuizResults ? (
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setShowQuizResults(false);
                      }}
                      className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>{activeLanguage === 'tamil' ? 'மீண்டும் தேர்வு எழுதுக' : 'Retake Test'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowQuizResults(true)}
                      disabled={Object.keys(selectedAnswers).length === 0}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span>{activeLanguage === 'tamil' ? 'தேர்வை சமர்ப்பித்து விடை சரிபார்க்க' : 'Submit Test & Check Answers'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PDF MATERIALS */}
          {activeTab === 'pdf' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Chapter {currentChapter} Downloadable PDF Material
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Official high-yield revision material prepared by academy faculty.</p>
                </div>

                <div className="flex items-center gap-2">
                  {syncFeedback && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fadeIn flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {syncFeedback}
                    </span>
                  )}
                  <button
                    onClick={handleManualPdfSync}
                    disabled={isPdfLoading}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    title="Refresh to fetch latest PDF and updates from Admin Console"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isPdfLoading ? 'animate-spin text-indigo-600' : ''}`} />
                    <span>Sync / Refresh PDF</span>
                  </button>
                </div>
              </div>

              <div className="p-6 bg-indigo-50/40 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 border border-slate-200 shadow-xs shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {detailedContent?.pdfFileName || detailedContent?.pdfTitle || `${subject.name}_Chapter${currentChapter}_Complete_Notes.pdf`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>PDF Document</span>
                      <span>•</span>
                      <span>{detailedContent?.pdfSize || 'Official Revision Material'}</span>
                      {detailedContent?.pdfFileName && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Latest Admin Upload
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      const displayTitle = detailedContent.pdfTitle || detailedContent.pdfFileName || `${subject.name} Chapter ${currentChapter} Notes`;
                      const currentUrl = detailedContent.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                      openPdfPreview(currentUrl, customContent?._pdfUrl_indexedDbKey, displayTitle);
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-indigo-500/25"
                  >
                    <Eye className="h-4 w-4" />
                    Open PDF Notes
                  </button>

                  <button 
                    onClick={() => {
                      const fileName = detailedContent.pdfFileName || detailedContent.pdfTitle || `${subject.name}_Chapter${currentChapter}_Notes.pdf`;
                      const currentUrl = detailedContent.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                      downloadPdfFile(currentUrl, customContent?._pdfUrl_indexedDbKey, fileName);
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-slate-600" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Chapter Navigation Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => {
                if (currentChapter > 1) {
                  handleStartChapter(currentChapter - 1);
                } else {
                  setCurrentChapter(null);
                }
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              {currentChapter > 1 ? `Chapter ${currentChapter - 1}` : 'Chapters List'}
            </button>

            <button
              onClick={() => toggleChapterCompletion(currentChapter)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                completedChapters.includes(currentChapter)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {completedChapters.includes(currentChapter) ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  Marked as Completed
                </>
              ) : (
                'Mark Chapter as Completed'
              )}
            </button>

            {currentChapter < 12 && (
              <button
                onClick={() => handleStartChapter(currentChapter + 1)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Next: Chapter {currentChapter + 1}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* VIEW B: ALL 12 CHAPTERS DIRECTORY */
        <div className="space-y-8">
          {/* Subject Header Banner */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${subject.bg} ${subject.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                {subject.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {examName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">12 Total Chapters</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{subject.name}</h2>
                <p className="text-xs text-slate-500 mt-1">Complete syllabus breakdown with notes, classes, and practice tests.</p>
              </div>
            </div>

            {/* Quick Chapter 1 Hero CTA */}
            <button
              onClick={() => handleStartChapter(1)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2.5 cursor-pointer shrink-0"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>{activeLanguage === 'tamil' ? 'அத்தியாயம் 1-ஐ உடனே தொடங்குக' : 'Start Chapter 1 Right Now'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Chapters Grid / List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {activeLanguage === 'tamil' ? 'பாடத்திட்ட அத்தியாயங்கள் (1 முதல் 12)' : 'Course Chapters (1 to 12)'}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {activeLanguage === 'tamil' ? 'படிக்கத் தொடங்க ஏதேனும் அத்தியாயத்தைக் கிளிக் செய்க' : 'Click on any chapter to start studying'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapters.map((ch) => {
                const isChapter1 = ch.number === 1;
                const isCompleted = completedChapters.includes(ch.number);

                return (
                  <motion.div
                    key={ch.number}
                    whileHover={{ y: -3 }}
                    onClick={() => handleStartChapter(ch.number)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isChapter1 
                        ? 'bg-blue-50/50 border-blue-300 hover:border-blue-500 shadow-sm ring-2 ring-blue-500/10' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isChapter1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {activeLanguage === 'tamil' ? `அத்தியாயம் ${ch.number}` : `Chapter ${ch.number}`}
                        </span>

                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <Check className="h-3 w-3" /> {activeLanguage === 'tamil' ? 'முடிந்தது' : 'Done'}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-semibold">{ch.duration}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {activeLanguage === 'tamil' ? ch.titleTa : ch.titleEn}
                      </h4>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {activeLanguage === 'tamil' ? ch.descriptionTa : ch.descriptionEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {ch.topicsCount} {activeLanguage === 'tamil' ? 'முக்கியக் குறிப்புகள்' : 'Key Topics'}
                      </span>

                      <span className={`flex items-center gap-1 ${
                        isChapter1 ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                      }`}>
                        {isChapter1 
                          ? (activeLanguage === 'tamil' ? 'அத்தியாயம் 1 படிக்க' : 'Study Chapter 1') 
                          : (activeLanguage === 'tamil' ? 'திறக்க' : 'Open Chapter')}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
