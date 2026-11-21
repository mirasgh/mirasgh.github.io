// All portfolio content lives here. Every text field is { en, fr }.
// Edit this file to update the site; components read from it.

const L = (en, fr) => ({ en, fr })
export const asset = (p) => `${import.meta.env.BASE_URL}${p}`

export const profile = {
  name: 'Miras GHRISSI',
  handle: 'miras',
  host: 'mechatronics',
  photo: asset('img/miras.jpg'),
  title: L('Mechatronics Engineering Student', 'Élève ingénieur en mécatronique'),
  tagline: L(
    'I build robotic systems from CAD to prototype: mechanical design, embedded electronics, computer vision and AI.',
    'Je conçois des systèmes robotiques de la CAO au prototype : conception mécanique, électronique embarquée, vision et IA.',
  ),
  status: L('SEEKING PFE · FEB 2027', 'RECHERCHE PFE · FÉV 2027'),
  seeking: L(
    'Looking for a final-year internship (PFE) starting February 2027 in robotics, embedded systems or vision.',
    'À la recherche d’un stage de fin d’études (PFE) à partir de février 2027 en robotique, systèmes embarqués ou vision.',
  ),
  about: L(
    'Mechatronics engineering student at ENISo (National School of Engineers of Sousse). I like projects where mechanics, electronics and software meet: a linkage designed in SOLIDWORKS, a Raspberry Pi that sees, an STM32 that drives the servos, and a model that decides. Active in student leadership as Vice President of the Eureka Club.',
    'Élève ingénieur en mécatronique à l’ENISo (École Nationale d’Ingénieurs de Sousse). J’aime les projets où mécanique, électronique et logiciel se rencontrent : un mécanisme conçu sous SOLIDWORKS, une Raspberry Pi qui voit, une STM32 qui pilote les servos et un modèle qui décide. Engagé dans la vie associative en tant que Vice-Président du Club Eureka.',
  ),
  location: L('Sousse, Tunisia', 'Sousse, Tunisie'),
  email: 'mirasghrissi2@gmail.com',
  phone: '+216 20 239 806',
  linkedin: 'https://www.linkedin.com/in/miras-ghrissi-1044a6327',
  linkedinLabel: 'linkedin.com/in/miras-ghrissi-1044a6327',
  cv: { en: asset('CV_Miras_Ghrissi_EN.pdf'), fr: asset('CV_Miras_Ghrissi_FR.pdf') },
}

export const stats = [
  { value: '10', label: L('engineering projects', 'projets d’ingénierie') },
  { value: '99.3%', label: L('accuracy · predictive maintenance', 'accuracy · maintenance prédictive') },
  { value: '4', label: L('languages spoken', 'langues parlées') },
  { value: '2027', label: L('PFE availability', 'disponibilité PFE') },
]

export const categories = [
  { id: 'all', label: L('ALL', 'TOUS') },
  { id: 'robotics', label: L('ROBOTICS', 'ROBOTIQUE') },
  { id: 'embedded', label: L('EMBEDDED', 'EMBARQUÉ') },
  { id: 'ai', label: L('AI & VISION', 'IA & VISION') },
  { id: 'cad', label: L('CAD & SIM', 'CAO & SIM') },
  { id: 'web', label: L('WEB', 'WEB') },
]

export const projects = [
  {
    id: 'ur5-vision',
    featured: true,
    year: '2026',
    cats: ['robotics', 'ai'],
    title: L('Vision-Guided Pick & Place · UR5 + RG2', 'Pick & Place guidé par vision · UR5 + RG2'),
    context: L('Robot vision project · CoppeliaSim + Python', 'Projet vision robotique · CoppeliaSim + Python'),
    summary: L(
      'A UR5 arm sorts coloured cubes seen by an overhead camera: detection, pixel→world mapping, validated IK and smooth joint-space motion.',
      'Un bras UR5 trie des cubes colorés vus par une caméra : détection, passage pixel→monde, IK validée et mouvement fluide dans l’espace articulaire.',
    ),
    details: L(
      [
        'Camera image → OpenCV colour segmentation detects red, green and blue cubes and returns their centres.',
        'Pixel coordinates converted to world coordinates (X, Y, Z) on the table plane.',
        'Two-level workspace check: Cartesian reach around the UR5 base, then joint-space validation (joint limits ±170°, elbow-up posture, elbow ≥ 20 cm and wrist ≥ 10 cm above the table).',
        'Each goal solved with IK and accepted only if the tip is within 5 mm and the gripper within 3° of vertical; otherwise the target is refused.',
        'Motion executed by smooth joint-space interpolation (0.8 rad/s), with descents and lifts split into small validated steps; each cube is placed in its colour zone.',
      ],
      [
        'Image caméra → segmentation couleur OpenCV qui détecte les cubes rouge, vert et bleu et retourne leurs centres.',
        'Conversion des coordonnées pixel en coordonnées monde (X, Y, Z) sur le plan de la table.',
        'Vérification de l’espace de travail sur 2 niveaux : portée cartésienne autour de la base UR5, puis validation articulaire (butées ±170°, coude en haut, coude ≥ 20 cm et poignet ≥ 10 cm au-dessus de la table).',
        'Chaque cible résolue par IK et acceptée seulement si la pince est à moins de 5 mm et à moins de 3° de la verticale ; sinon la cible est refusée.',
        'Mouvement par interpolation articulaire fluide (0,8 rad/s), descentes et montées découpées en petits pas validés ; chaque cube est déposé dans sa zone de couleur.',
      ],
    ),
    metrics: [
      { k: L('IK tolerance', 'Tolérance IK'), v: '5 mm / 3°' },
      { k: L('Grasp error max', 'Erreur de saisie max'), v: '2 cm' },
      { k: L('Joint speed', 'Vitesse articulaire'), v: '0.8 rad/s' },
    ],
    stack: ['Python', 'CoppeliaSim', 'OpenCV', 'NumPy', 'ZMQ Remote API', 'Inverse kinematics'],
    images: ['img/ur5-detections.png', 'img/ur5-camera.png'],
  },
  {
    id: 'fourbar-arm',
    featured: true,
    year: '2026',
    cats: ['robotics', 'embedded', 'cad'],
    title: L('Four-Bar Robotic Gripper Arm with Vision', 'Bras robotique à quatre barres avec vision'),
    context: L('ENISo project', 'Projet ENISo'),
    summary: L(
      'Design and simulation of a four-bar linkage arm that picks and drops objects. A Raspberry Pi 4 runs detection; an STM32 drives the servomotors.',
      'Conception et simulation d’un bras à mécanisme quatre barres qui saisit et dépose des objets. Une Raspberry Pi 4 exécute la détection ; une STM32 pilote les servomoteurs.',
    ),
    details: L(
      [
        'Four-bar linkage designed and simulated for a pick-and-place workspace.',
        'Raspberry Pi 4 runs the object-detection model on the camera stream.',
        'Pi → STM32 command link; the STM32 (STM32CubeIDE) generates the PWM that drives the servomotors.',
        'Split architecture: high-level perception on Linux, real-time actuation on the microcontroller.',
      ],
      [
        'Mécanisme quatre barres conçu et simulé pour un espace de travail pick-and-place.',
        'La Raspberry Pi 4 exécute le modèle de détection sur le flux caméra.',
        'Liaison de commande Pi → STM32 ; la STM32 (STM32CubeIDE) génère les PWM des servomoteurs.',
        'Architecture séparée : perception haut niveau sous Linux, actionnement temps réel sur le microcontrôleur.',
      ],
    ),
    metrics: [
      { k: L('Vision', 'Vision'), v: 'Raspberry Pi 4' },
      { k: L('Actuation', 'Actionnement'), v: 'STM32 + servos' },
    ],
    stack: ['SOLIDWORKS', 'Raspberry Pi 4', 'STM32', 'C/C++', 'Python', 'Computer vision'],
    schematic: 'fourbar',
  },
  {
    id: 'smart-gripper',
    featured: true,
    year: '2024–2025',
    cats: ['embedded', 'robotics', 'ai'],
    title: L('Smart Gripper with Vision & Force Feedback', 'Système de serrage intelligent avec vision et retour d’effort'),
    context: L('ENISo semester project · Industry 4.0 workshop', 'Projet semestriel ENISo · Atelier 4.0'),
    summary: L(
      'Adaptive clamping system that measures the real clamping force and adapts it to each part, so fragile parts are never crushed and machined parts never slip.',
      'Système de serrage adaptatif qui mesure la force réelle et l’adapte à chaque pièce : les pièces fragiles ne sont pas écrasées, les pièces usinées ne glissent pas.',
    ),
    details: L(
      [
        'Raspberry Pi controller with closed-loop force feedback from force sensors.',
        'Computer vision identifies the part; a material database sets the target clamping force.',
        'Pneumatic actuation of the clamp.',
        'Python interface for real-time control, monitoring and traceability.',
      ],
      [
        'Contrôleur Raspberry Pi avec boucle de retour d’effort à partir de capteurs de force.',
        'La vision identifie la pièce ; une base de données matériaux fixe la force de serrage cible.',
        'Actionnement pneumatique de l’étau.',
        'Interface Python pour la commande temps réel, la supervision et la traçabilité.',
      ],
    ),
    metrics: [
      { k: L('Control', 'Commande'), v: L('closed-loop force', 'effort en boucle fermée') },
      { k: L('Actuation', 'Actionnement'), v: L('pneumatic', 'pneumatique') },
    ],
    stack: ['Raspberry Pi', 'Python', 'Force sensors', 'Pneumatics', 'Computer vision'],
    images: ['img/smart-gripper.png'],
  },
  {
    id: 'predictive-maintenance',
    featured: true,
    year: '2026',
    cats: ['ai'],
    title: L('Predictive Maintenance of a Machine Tool', 'Maintenance prédictive d’une machine-outil'),
    context: L('ENISo project · ML + fuzzy logic', 'Projet ENISo · ML + logique floue'),
    summary: L(
      'Failure prediction on AI4I 2020 (10,000 cycles, 3.4% failures) with Random Forest / XGBoost, then a fuzzy system that turns risk, tool wear and heating into a maintenance priority.',
      'Prédiction des pannes sur AI4I 2020 (10 000 cycles, 3,4 % de pannes) par Random Forest / XGBoost, puis un système flou qui transforme risque, usure et échauffement en priorité de maintenance.',
    ),
    details: L(
      [
        'Physics-based features (power, ΔT, wear × torque); failure-mode columns removed to avoid information leakage.',
        'Stratified 80/20 split, class weighting instead of synthetic oversampling, threshold tuned on out-of-fold predictions only.',
        'Random Forest kept: 56 of 68 test failures detected with only 2 false alarms, under 0.1 ms per prediction.',
        'scikit-fuzzy system (risk, wear, heating → low / medium / urgent): almost 4× fewer false alarms than fixed thresholds (39 vs 151).',
        'Usable by an operator through a Streamlit web app or an Excel in → Excel out pipeline.',
      ],
      [
        'Variables physiques (puissance, ΔT, usure × couple) ; colonnes de modes de panne retirées pour éviter la fuite d’information.',
        'Découpage stratifié 80/20, pondération des classes plutôt que données synthétiques, seuil réglé uniquement sur prédictions out-of-fold.',
        'Random Forest retenu : 56 pannes détectées sur 68 avec seulement 2 fausses alarmes, moins de 0,1 ms par prédiction.',
        'Système flou scikit-fuzzy (risque, usure, échauffement → faible / moyenne / urgente) : presque 4× moins de fausses alarmes que des seuils fixes (39 contre 151).',
        'Utilisable par un opérateur via une application web Streamlit ou un pipeline Excel → Excel.',
      ],
    ),
    metrics: [
      { k: 'Accuracy', v: '99.3%' },
      { k: L('Precision', 'Précision'), v: '96.6%' },
      { k: L('Recall', 'Rappel'), v: '82.4%' },
      { k: 'F1', v: '0.889' },
      { k: 'ROC-AUC', v: '0.972' },
    ],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'scikit-fuzzy', 'pandas', 'Streamlit', 'Kaggle'],
    images: ['img/pm-confusion.png', 'img/pm-fuzzy.png', 'img/pm-importance.png', 'img/pm-pr.png'],
  },
  {
    id: 'web-arm',
    year: '2026',
    cats: ['robotics', 'web', 'embedded'],
    title: L('Web-Controlled Robotic Arm', 'Bras robotique commandé par un site web'),
    context: L('Robotics + web dashboard', 'Robotique + tableau de bord web'),
    summary: L(
      'Robotic arm driven from a browser dashboard: per-joint sliders, home / pick / place presets, a manual joystick and a live camera view.',
      'Bras robotique piloté depuis un tableau de bord web : curseurs par articulation, positions home / pick / place, joystick manuel et vue caméra en direct.',
    ),
    details: L(
      [
        'Control dashboard with connection status and per-joint angle sliders.',
        'One-click presets: Home, Pick object, Place object, Reset.',
        'Manual control pad and live camera stream of the arm.',
      ],
      [
        'Tableau de bord avec état de connexion et curseurs d’angle par articulation.',
        'Positions en un clic : Home, Pick, Place, Reset.',
        'Pavé de commande manuelle et flux caméra du bras en direct.',
      ],
    ),
    stack: ['Robot arm', 'Servomotors', 'Web dashboard', 'Camera'],
    images: ['img/web-arm.jpg'],
  },
  {
    id: 'webots-robot',
    year: '2026',
    cats: ['robotics', 'ai', 'cad'],
    title: L('Vision-Guided Robot in Webots', 'Robot guidé par vision sous Webots'),
    context: L('ENISo project · simulation', 'Projet ENISo · simulation'),
    summary: L(
      'Simulation of a camera-equipped robot in Webots: image processing detects the target and commands the robot’s motion.',
      'Simulation d’un robot équipé d’une caméra sous Webots : le traitement d’image détecte la cible et commande le mouvement du robot.',
    ),
    details: L(
      [
        'Camera sensor in the loop: each frame is processed to locate the target.',
        'Detection result converted into motion commands for the robot controller.',
        'Full scene built and tested in simulation before any hardware.',
      ],
      [
        'Caméra dans la boucle : chaque image est traitée pour localiser la cible.',
        'Le résultat de la détection est converti en commandes de mouvement du robot.',
        'Scène complète construite et testée en simulation avant tout matériel.',
      ],
    ),
    stack: ['Webots', 'Python', 'Computer vision', 'Robot control'],
    images: ['img/webots.png'],
  },
  {
    id: 'stair-lift',
    year: L('Semester project', 'Projet semestriel'),
    cats: ['cad'],
    title: L('Platform Lift for People with Reduced Mobility', 'Élévateur pour personnes à mobilité réduite'),
    context: L('Study & design · SOLIDWORKS', 'Étude et conception · SOLIDWORKS'),
    summary: L(
      'Inclined stair platform lift for a wheelchair user, from functional analysis to a full SOLIDWORKS assembly, FEA check and technical drawings.',
      'Plateforme élévatrice inclinée pour fauteuil roulant, de l’analyse fonctionnelle à l’assemblage SOLIDWORKS complet, la vérification par éléments finis et le dossier technique.',
    ),
    details: L(
      [
        'Requirements: 200 kg maximum load, at least 1 m of travel, safety system, standard electric supply, low cost and durability.',
        'Functional analysis and weighted decision matrices: rack-and-pinion drive (score 35 vs 31 / 31) and cylindrical columns with rollers for guidance (35 vs 32 / 31).',
        'Full 3D assembly in SOLIDWORKS, shown in initial, intermediate and final positions.',
        'Static FEA: max von Mises stress ≈ 0.12 MPa, far below the 351.6 MPa yield strength.',
        'Technical file with drawings of every part to manufacture.',
      ],
      [
        'Cahier des charges : charge maximale 200 kg, course d’au moins 1 m, système de sécurité, alimentation électrique standard, faible coût et durabilité.',
        'Analyse fonctionnelle et matrices de décision pondérées : entraînement pignon-crémaillère (35 contre 31 / 31) et guidage par colonnes cylindriques et galets (35 contre 32 / 31).',
        'Assemblage 3D complet sous SOLIDWORKS, présenté en états initial, intermédiaire et final.',
        'Analyse statique par éléments finis : contrainte de von Mises max ≈ 0,12 MPa, très inférieure à la limite d’élasticité de 351,6 MPa.',
        'Dossier technique avec les mises en plan de toutes les pièces à fabriquer.',
      ],
    ),
    metrics: [
      { k: L('Max load', 'Charge max'), v: '200 kg' },
      { k: L('Travel', 'Course'), v: '≥ 1 m' },
      { k: L('Drive', 'Entraînement'), v: L('rack & pinion', 'pignon-crémaillère') },
    ],
    stack: ['SOLIDWORKS', 'FEA', 'Functional analysis', 'Technical drawings'],
    images: ['img/lift-cad.png', 'img/lift-fea.jpg'],
  },
  {
    id: 'karman',
    year: '2026',
    cats: ['cad'],
    title: L('Kármán Vortex Street Behind a Cylinder', 'Allée de Kármán derrière un cylindre'),
    context: L('CFD simulation · Ansys', 'Simulation CFD · Ansys'),
    summary: L(
      'CFD simulation of vortex shedding behind a cylinder to study unsteady flow and the formation of the von Kármán vortex street.',
      'Simulation CFD du détachement tourbillonnaire derrière un cylindre pour étudier l’écoulement instationnaire et la formation de l’allée de von Kármán.',
    ),
    details: L(
      [
        'Inlet velocity U = 1.5 m/s, cylinder diameter D = 0.1 m, Reynolds number Re = 150.',
        'Vorticity field shows alternating upper (positive) and lower (negative) vortices.',
        'Residual convergence monitored over the iterations.',
      ],
      [
        'Vitesse d’entrée U = 1,5 m/s, diamètre D = 0,1 m, nombre de Reynolds Re = 150.',
        'Le champ de vorticité montre l’alternance des tourbillons supérieurs (positifs) et inférieurs (négatifs).',
        'Convergence des résidus suivie au fil des itérations.',
      ],
    ),
    metrics: [
      { k: 'Re', v: '150' },
      { k: 'U', v: '1.5 m/s' },
      { k: 'D', v: '0.1 m' },
    ],
    stack: ['Ansys', 'CFD', 'Fluid mechanics'],
    images: ['img/karman.jpg'],
  },
  {
    id: 'pfe-agent',
    year: '2026',
    cats: ['ai'],
    title: L('AI Agent for PFE Project Matching', 'Agent IA de recommandation de sujets PFE'),
    context: L('Python · AI agents', 'Python · agents IA'),
    summary: L(
      'An AI agent that searches for final-year (PFE) project offers and recommends the ones that best fit a student’s skills.',
      'Un agent IA qui recherche des offres de PFE et recommande celles qui correspondent le mieux aux compétences d’un étudiant.',
    ),
    details: L(
      [
        'Takes a skills profile as input.',
        'Searches PFE offers and ranks them by fit with the profile.',
        'Returns a shortlist of recommended subjects.',
      ],
      [
        'Prend un profil de compétences en entrée.',
        'Recherche des offres de PFE et les classe selon leur adéquation au profil.',
        'Retourne une liste courte de sujets recommandés.',
      ],
    ),
    stack: ['Python', 'AI agents', 'LLM'],
    schematic: 'agent',
  },
  {
    id: 'jeeniso-web',
    year: '2025',
    cats: ['web'],
    title: L('JEENISO Website · UI/UX + React', 'Site JEENISO · UI/UX + React'),
    context: L('Junior Enterprise ENISo', 'Junior Entreprise ENISo'),
    summary: L(
      'Designed in Figma and built with React.js and Tailwind CSS: landing, products, item store, projects, partners, docs, magazine and contact pages.',
      'Maquetté sous Figma et développé en React.js et Tailwind CSS : accueil, produits, boutique, projets, partenaires, docs, magazine et contact.',
    ),
    details: L(
      [
        'Full UI/UX mock-up in Figma (9 pages) before any code.',
        'Responsive implementation with React.js and Tailwind CSS.',
        'Focus on clean layout, usability and a consistent visual system.',
      ],
      [
        'Maquette UI/UX complète sous Figma (9 pages) avant le code.',
        'Intégration responsive en React.js et Tailwind CSS.',
        'Accent sur une mise en page claire, l’ergonomie et un système visuel cohérent.',
      ],
    ),
    stack: ['React.js', 'Tailwind CSS', 'Figma', 'UI/UX'],
    images: ['img/jeeniso.jpg', 'img/figma.png'],
  },
]

export const skillGroups = [
  {
    id: 'cad',
    title: L('CAD & Mechanical Design', 'CAO & conception mécanique'),
    items: ['SOLIDWORKS', 'Mastercam', 'Functional analysis', 'Mechanism design', 'Technical drawings'],
  },
  {
    id: 'sim',
    title: L('Simulation & Analysis', 'Simulation & calcul'),
    items: ['Ansys', 'CFD', 'FEA', 'Abaqus', 'MATLAB', 'Webots', 'CoppeliaSim'],
  },
  {
    id: 'robotics',
    title: L('Robotics', 'Robotique'),
    items: ['Inverse kinematics', 'Pick & place', 'Workspace analysis', 'Trajectory planning', 'Gripper design'],
  },
  {
    id: 'embedded',
    title: L('Embedded & IoT', 'Embarqué & IoT'),
    items: ['STM32', 'Raspberry Pi', 'Arduino', 'Xilinx', 'MQTT', 'Servo / PWM', 'Force sensors', 'Proteus'],
  },
  {
    id: 'automation',
    title: L('Industrial Automation', 'Automatisme industriel'),
    items: ['TIA Portal (Siemens)', 'Automation Studio', 'Pneumatics', 'Sensors & relays'],
  },
  {
    id: 'ai',
    title: L('AI & Computer Vision', 'IA & vision par ordinateur'),
    items: ['OpenCV', 'Computer vision', 'scikit-learn', 'XGBoost', 'scikit-fuzzy', 'pandas', 'Streamlit', 'AI agents', 'Kaggle'],
  },
  {
    id: 'software',
    title: L('Software & Web', 'Logiciel & web'),
    items: ['Python', 'C/C++', 'React.js', 'Tailwind CSS', 'Figma', 'Git', 'Linux'],
  },
]

// Which skill chips map to which projects (case-insensitive match on project.stack + extras).
export const skillAliases = {
  SOLIDWORKS: ['fourbar-arm', 'stair-lift'],
  'Functional analysis': ['stair-lift'],
  'Mechanism design': ['fourbar-arm', 'stair-lift', 'smart-gripper'],
  'Technical drawings': ['stair-lift'],
  Ansys: ['karman'],
  CFD: ['karman'],
  FEA: ['stair-lift'],
  Webots: ['webots-robot'],
  CoppeliaSim: ['ur5-vision'],
  'Inverse kinematics': ['ur5-vision'],
  'Pick & place': ['ur5-vision', 'fourbar-arm', 'web-arm'],
  'Workspace analysis': ['ur5-vision'],
  'Trajectory planning': ['ur5-vision'],
  'Gripper design': ['fourbar-arm', 'smart-gripper'],
  STM32: ['fourbar-arm'],
  'Raspberry Pi': ['fourbar-arm', 'smart-gripper'],
  'Servo / PWM': ['fourbar-arm', 'web-arm'],
  'Force sensors': ['smart-gripper'],
  Pneumatics: ['smart-gripper'],
  OpenCV: ['ur5-vision'],
  'Computer vision': ['ur5-vision', 'fourbar-arm', 'smart-gripper', 'webots-robot'],
  'scikit-learn': ['predictive-maintenance'],
  XGBoost: ['predictive-maintenance'],
  'scikit-fuzzy': ['predictive-maintenance'],
  pandas: ['predictive-maintenance'],
  Streamlit: ['predictive-maintenance'],
  'AI agents': ['pfe-agent'],
  Kaggle: ['predictive-maintenance'],
  Python: ['ur5-vision', 'fourbar-arm', 'smart-gripper', 'predictive-maintenance', 'webots-robot', 'pfe-agent'],
  'C/C++': ['fourbar-arm'],
  'React.js': ['jeeniso-web'],
  'Tailwind CSS': ['jeeniso-web'],
  Figma: ['jeeniso-web'],
}

export const experience = [
  {
    role: L('Production Intern', 'Stagiaire production'),
    org: 'LEONI Wiring Systems (LTN3_1)',
    place: L('Messadine, Sousse', 'Messadine, Sousse'),
    date: L('Jul 2025', 'Juil. 2025'),
    points: L(
      [
        'Assembled and installed electrical and mechanical modules for the test tables used in cable-harness production.',
        'Worked on a high-volume automotive production line with its quality and safety standards.',
      ],
      [
        'Montage et installation de modules électriques et mécaniques pour les tables de test utilisées en production de faisceaux.',
        'Travail sur une ligne de production automobile à grand volume, avec ses exigences qualité et sécurité.',
      ],
    ),
  },
]

export const leadership = [
  {
    role: L('Vice President, Internal Affairs', 'Vice-Président, Affaires internes'),
    org: 'Eureka Club · ENISo',
    date: L('Since 2024', 'Depuis 2024'),
    desc: L('Led internal club operations and member coordination.', 'Gestion des opérations internes du club et coordination des membres.'),
  },
  {
    role: L('Head of D-Day Committee', 'Responsable du comité Jour J'),
    org: 'ENISo Smart Challenge',
    date: '2026',
    desc: L(
      'Managed on-site logistics, scheduling and team coordination on the main event day.',
      'Gestion de la logistique sur site, du planning et de la coordination des équipes le jour de l’événement.',
    ),
  },
]

export const education = [
  {
    school: L('ENISo · National School of Engineers of Sousse', 'ENISo · École Nationale d’Ingénieurs de Sousse'),
    degree: L('Engineering degree, Mechatronics', 'Diplôme d’ingénieur, Mécatronique'),
    date: L('2024 – 2027', '2024 – 2027'),
    current: true,
  },
  {
    school: L('IPEIM · Preparatory Institute for Engineering Studies of Monastir', 'IPEIM · Institut Préparatoire aux Études d’Ingénieurs de Monastir'),
    degree: L('Preparatory engineering program', 'Cycle préparatoire aux études d’ingénieur'),
    date: '2021 – 2024',
  },
]

export const languages = [
  { name: L('Arabic', 'Arabe'), level: L('Native', 'Langue maternelle'), value: 100 },
  { name: L('French', 'Français'), level: L('Fluent', 'Courant'), value: 90 },
  { name: L('English', 'Anglais'), level: L('Fluent', 'Courant'), value: 88 },
  { name: L('German', 'Allemand'), level: L('Basic', 'Notions'), value: 30 },
]

export const nav = [
  { id: 'root', label: L('ROOT', 'RACINE') },
  { id: 'projects', label: L('PROJECTS', 'PROJETS') },
  { id: 'skills', label: L('SKILLS', 'COMPÉTENCES') },
  { id: 'experience', label: L('EXPERIENCE', 'EXPÉRIENCE') },
  { id: 'leadership', label: L('LEADERSHIP', 'LEADERSHIP') },
  { id: 'education', label: L('EDUCATION', 'FORMATION') },
  { id: 'contact', label: L('CONTACT', 'CONTACT') },
]

export const ui = {
  status: L('STATUS', 'STATUT'),
  downloadCv: L('DOWNLOAD CV', 'TÉLÉCHARGER CV'),
  light: L('LIGHT', 'CLAIR'),
  dark: L('DARK', 'SOMBRE'),
  termMode: L('PURE_TERMINAL_MODE', 'MODE_TERMINAL_PUR'),
  exitGui: L('EXIT TO NORMAL GUI', 'RETOUR À L’INTERFACE'),
  openTerminal: L('Open pure terminal mode', 'Ouvrir le mode terminal pur'),
  viewProjects: L('VIEW PROJECTS', 'VOIR LES PROJETS'),
  contactMe: L('CONTACT ME', 'ME CONTACTER'),
  armHint: L(
    'Interactive · move to steer the arm · click near a cube to grab it, click again to drop it',
    'Interactif · bougez pour guider le bras · cliquez près d’un cube pour le saisir, recliquez pour le lâcher',
  ),
  armAuto: L('AUTO', 'AUTO'),
  armManual: L('MANUAL', 'MANUEL'),
  gripper: L('GRIPPER', 'PINCE'),
  open: L('OPEN', 'OUVERTE'),
  closed: L('CLOSED', 'FERMÉE'),
  payload: L('PAYLOAD', 'CHARGE'),
  none: L('NONE', 'AUCUNE'),
  reset: L('RESET', 'RESET'),
  details: L('DETAILS', 'DÉTAILS'),
  close: L('CLOSE', 'FERMER'),
  stack: L('STACK', 'TECHNOS'),
  results: L('KEY_FIGURES', 'CHIFFRES_CLÉS'),
  whatIDid: L('WHAT_I_DID', 'RÉALISATION'),
  skillHint: L('Click a skill to see the projects that use it.', 'Cliquez sur une compétence pour voir les projets qui l’utilisent.'),
  usedIn: L('USED_IN', 'UTILISÉ_DANS'),
  noProject: L('Course / training skill, no portfolio project listed yet.', 'Compétence acquise en cours, pas encore de projet listé.'),
  languages: L('LANGUAGES', 'LANGUES'),
  current: L('IN PROGRESS', 'EN COURS'),
  rights: L('ALL_RIGHTS_RESERVED', 'TOUS_DROITS_RÉSERVÉS'),
  copyEmail: L('Copy email', 'Copier l’email'),
  copied: L('COPIED', 'COPIÉ'),
  contactTitle: L('Let’s build something that moves.', 'Construisons quelque chose qui bouge.'),
  contactText: L(
    'Open to a PFE internship from February 2027 and to robotics, embedded or vision collaborations. The fastest way to reach me is email.',
    'Ouvert à un stage PFE à partir de février 2027 et à des collaborations en robotique, embarqué ou vision. Le plus rapide : l’email.',
  ),
  showing: L('showing', 'affichés'),
}
