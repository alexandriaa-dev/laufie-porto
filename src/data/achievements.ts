export const achievementsStats = [
  { label: 'Total Awards', value: '5+' },
  { label: 'Years Learning', value: '5+' },
  { label: 'Competitions Joined', value: '10+' },
  { label: 'Certifications', value: '12+' },
]

export type Achievement = {
  id: string
  title: string
  org: string
  year: string
  badge?: string
  description?: string
  certificateImage?: string // path ke image sertifikat di assets/images/sertif
  category?: 'award' | 'experience' // kategori: award (menang lomba) atau experience (pengalaman/certification)
}

export const achievements: Achievement[] = [
  {
    id: 'award-1',
    title: 'SATRIA: Smart AI & Tech Competition for a Rising',
    org: 'BINUS University',
    year: '2025',
    badge: 'Silver',
    category: 'award',
    description: '•	Selected as a national finalist and awarded Silver Medal in a rigorous Data Science & AI competition.\n•	Built an end-to-end machine learning solution, from feature engineering to model evaluation, defending analytical decisions before academic judges.',
    certificateImage: 'satria.png',
  },
  {
    id: 'award-2',
    title: 'LKS Dikmen Tingkat Jawa Timur Bidang Artificial Inteligence',
    org: 'Kementrian Pendidikan Dasar dan Menengah',
    year: '2025',
    badge: 'Bronze',
    category: 'award',
    description: '•	Outperformed participants in a prestigious national competency competition.\n•	Designed, evaluated, and justified machine learning models under strict time constraints, focusing on defensible analytics and reproducibility.',
    certificateImage: 'lks-jatim.png',
  },
  {
    id: 'award-3',
    title: 'Airlangga Youth Olympiad Bidang Bahasa Inggris',
    org: 'BEM FKP Universitas Airlangga',
    year: '2025',
    badge: 'Gold',
    category: 'award',
    description: 'Secured Gold Medal in the senior high school category at a national-level competition organized by a top-tier Indonesian university.',
    certificateImage: 'ayo2025.png',
  },
  {
    id: 'award-4',
    title: 'Kompetisi Festival Olimpiade',
    org: 'University ID Educational Platform',
    year: '2026',
    badge: 'Gold',
    category: 'award',
    description: 'Achieved top rankings in both provincial and national categories, demonstrating strong logical reasoning and algorithmic problem-solving skills.\nEnglish: #45 in East Java, #238 in National.\nMathematics: #45 in East Java, #267 in National.\nInformatics: #5 in East Java, #21 in National.',
    certificateImage: 'fo2026-informatika.png',
  },
  {
    id: 'award-5',
    title: 'Kompetisi Festival Olimpiade',
    org: 'University ID Educational Platform',
    year: '2025',
    badge: 'Gold',
    category: 'award',
    description: 'Achieved top rankings in both provincial and national categories, demonstrating strong logical reasoning and algorithmic problem-solving skills.\nEnglish: #15 in East Java, #76 in National.\nMathematics: #41 in East Java, #208 in National.',
    certificateImage: 'fo2025-bing.png',
  },
  {
    id: 'cert-1',
    title: 'Bootcamp LKS Artificial Intelligence',
    org: 'PT Universal Big Data',
    year: '2025',
    badge: 'Certified',
    category: 'experience',
    description: '•	Completed intensive training in Data Modeling and Big Data Analytics. Applied Python for complex dataset problem-solving in preparation for national competitions.',
    certificateImage: 'ubig2025.png',
  },
  {
    id: 'cert-2',
    title: 'Data Analyst Intern',
    org: 'Universitas Islam Negeri Maulana Malik Ibrahim Malang',
    year: '2025',
    badge: 'Internship',
    category: 'experience',
    description: '•	Designed a web-based Attendance System to improve administrative data efficiency and reduce manual tracking.\n•	Conducted data analysis and visualization using Orange Data Mining to support institutional decision-making and reporting.',
    certificateImage: 'UIN-PKL.png',
  },
  {
    id: 'cert-3',
    title: 'Java Programming',
    org: 'Dicoding Academy',
    year: '2024',
    badge: 'Certified',
    category: 'experience',
    description: 'Completed Java Programming certification program from Dicoding Academy. The program covered Java fundamentals, OOP, collection framework, and best practices in Java application development.',
    certificateImage: 'dicoding-java.png',
  },
]