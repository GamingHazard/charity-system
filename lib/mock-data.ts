interface Event {
  _id: string;
  title: string;
  date: string;
  description: string;
  image: {
    url: string;
    public_id: string;
  };
  time: string;
  topic: string;
  location: {
    address: string;
  };
}
interface Post {
  _id: string;
  title: string;
  excerpt: string;
  image: {
    url: string;
    public_id: string;
  };
  content: string;
  author: string;

  date: string;
  status: "published" | "draft";
  likes: string[];
  views: string[];
  comments: {
    name: string;
    comment: string;
    commentedOn: string;
  }[];
}

export interface Campaign {
  _id: string;
  title: string;
  tagline: string;
  description: string;
  image: {
    url: string;
    public_id: string;
  };
  goal: number;
  raised: number;
  endDate: string;
  status: "ongoing" | "upcoming" | "completed" | string;
  donations: string[];
}

export interface PaymentRecord {
  id?: string;
  receiptId?: string;
  date: string;
  amount: number;
  method: string;
  status: "Completed" | "Pending" | "Failed";
  transactionId?: string;
  note?: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface SponsorshipRecord {
  [key: string]: any;
  _id: string;
  child?: any;
  donor: any;
  plan?: string;
  monthlyAmount: number;
  status: "Active" | "Pending" | "Paused" | "Completed";
  startDate: string;
  lastPayment: string;
  totalPaid: number;
  payments: PaymentRecord[];
  notes: string;
}

export interface SponsorshipProfile {
  _id: string;
  name: string;
  firstName: string;
  secondName: string;
  givenName: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  age: number;
  ageGroup: "0-5" | "6-12" | "13-18";
  class: string;
  nationality: string;
  familyStatus: "Total Orphans" | "Single Parent";
  numberOfParents: 0 | 1 | 2;
  guardianName: string;
  guardianContact: string;
  guardianRelation:
    | "caretaker"
    | "mom"
    | "dad"
    | "sibling"
    | "uncle"
    | "aunt"
    | "grandparent";
  image: {
    url: string;
    public_id: string;
  };
  background: string;
  school: string;
  location: string;
  needs: any;
  monthlyNeed: string;
  education?: {
    isStudying?: boolean;
    currentLevel?: string;
    schoolName?: string;
    classGrade?: string;
    currentClass?: string;
    academicYear?: string;
    expectedGraduationYear?: string;
    lastTermResult?: string;
    graduationTarget?: string;
    estimatedGraduationYear?: string;
    educationNotes?: string;
  };
  reportCards?: Array<{
    name?: string;
    description?: string;
    url?: string;
    public_id?: string;
    fileType?: string;
    uploadedAt?: string;
  }>;
  progress: number;
  sponsorshipStatus: string;
  sponsor?: any;
}

export const mockSponsorshipProfiles: SponsorshipProfile[] = [
  {
    _id: "kid-1",
    name: "Amina",
    firstName: "Amina",
    secondName: "Komagum",
    givenName: "Amina",
    gender: "Female",
    dateOfBirth: "2018-03-15",
    age: 8,
    ageGroup: "6-12",
    class: "Primary 3",
    nationality: "Ugandan",
    familyStatus: "Single Parent",
    numberOfParents: 1,
    guardianName: "Juliana Komagum",
    guardianContact: "Not provided",
    guardianRelation: "mom",
    image: {
      url: "https://thumbs.dreamstime.com/b/african-child-girl-years-old-local-beach-dar-es-salaam-nikon-d-57401857.jpg",
      public_id: "sponsorship/amina",
    },
    background:
      "Amina is a bright and curious learner who excels in her studies. Despite her family's financial challenges, she maintains a positive attitude and helps her mother with household chores. She wants to study hard to become a teacher and give back to her community.",
    school: "St. Mary’s Primary School",
    location: "Kampala, Uganda",
    needs: ["Education", "Basic needs", "Health & Nutrition support"],
    monthlyNeed: "$50/month",
    progress: 42,
    sponsorshipStatus: "Available",
  },
  {
    _id: "kid-2",
    name: "David",
    firstName: "David",
    secondName: "Omusu",
    givenName: "David",
    gender: "Male",
    dateOfBirth: "2014-06-20",
    age: 12,
    ageGroup: "6-12",
    class: "Primary 6",
    nationality: "Ugandan",
    familyStatus: "Total Orphans",
    numberOfParents: 0,
    guardianName: "Thomas Omusu",
    guardianContact: "Not provided",
    guardianRelation: "uncle",
    image: {
      url: "https://thumbs.dreamstime.com/b/african-child-2693809.jpg",
      public_id: "sponsorship/david",
    },
    background:
      "David lost both parents five years ago and is being raised by his uncle. Despite this hardship, he shows remarkable resilience and academic strength. He spends his afternoons helping with farming and caring for younger siblings. David dreams of becoming a scientist and contributing to his community's development.",
    school: "Hope Children’s School",
    location: "Mukono, Uganda",
    needs: ["Education", "Basic needs", "Health & Nutrition support"],
    monthlyNeed: "$60/month",
    progress: 33,
    sponsorshipStatus: "Available",
  },
  {
    _id: "kid-3",
    name: "Lillian",
    firstName: "Lillian",
    secondName: "Nakazi",
    givenName: "Lillian",
    gender: "Female",
    dateOfBirth: "2021-02-10",
    age: 5,
    ageGroup: "0-5",
    class: "Primary 1",
    nationality: "Ugandan",
    familyStatus: "Single Parent",
    numberOfParents: 1,
    guardianName: "Moses Nakazi",
    guardianContact: "Not provided",
    guardianRelation: "dad",
    image: {
      url: "https://thumbs.dreamstime.com/b/cute-african-girl-flower-hair-close-up-portrait-little-child-braids-orange-standing-outdoors-against-green-63503699.jpg",
      public_id: "sponsorship/lillian",
    },
    background:
      "Lillian is a cheerful and energetic child who brings joy to everyone around her. Her mother passed away three years ago, and her father works as a casual laborer to provide for the family. Despite their limited means, Lillian attends preschool with great enthusiasm. She has a natural talent for music and loves to sing traditional songs.",
    school: "Bright Beginnings Preschool",
    location: "Jinja, Uganda",
    needs: ["Education", "Basic needs", "Health & Nutrition support"],
    monthlyNeed: "$45/month",
    progress: 58,
    sponsorshipStatus: "Available",
  },
  {
    _id: "kid-4",
    name: "Samuel",
    firstName: "Samuel",
    secondName: "Kiprotich",
    givenName: "Samuel",
    gender: "Male",
    dateOfBirth: "2011-01-05",
    age: 15,
    ageGroup: "13-18",
    class: "Senior 3",
    nationality: "Ugandan",
    familyStatus: "Total Orphans",
    numberOfParents: 0,
    guardianName: "Rose Kiplagat",
    guardianContact: "Not provided",
    guardianRelation: "grandparent",
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSajvAiV-qlyAIZBTwsFZVJt0wkY0w0k6WeWA&s",
      public_id: "sponsorship/samuel",
    },
    background:
      "Samuel has shown exceptional promise despite losing both parents at age 7. He is now in secondary school and consistently earns high marks in mathematics and science. Living with his elderly grandmother, Samuel balances his studies with helping in the farm and taking care of younger cousins. His dream is to study engineering and build water systems for rural communities.",
    school: "National High School",
    location: "Wakiso, Uganda",
    needs: ["Education", "Basic needs", "Health & Nutrition support"],
    monthlyNeed: "$70/month",
    progress: 27,
    sponsorshipStatus: "Available",
  },
  {
    _id: "kid-5",
    name: "Grace",
    firstName: "Grace",
    secondName: "Okumu",
    givenName: "Grace",
    gender: "Female",
    dateOfBirth: "2016-08-22",
    age: 10,
    ageGroup: "6-12",
    class: "Primary 5",
    nationality: "Ugandan",
    familyStatus: "Single Parent",
    numberOfParents: 1,
    guardianName: "Miriam Okumu",
    guardianContact: "Not provided",
    guardianRelation: "mom",
    image: {
      url: "https://t3.ftcdn.net/jpg/03/11/48/70/360_F_311487027_oIFZmgqD5Xv1T7jrKRcXMUJEfrTOZcRD.jpg",
      public_id: "sponsorship/grace",
    },
    background:
      "Grace is known for her infectious smile and kind heart. Her father was a fisherman who passed away when she was three years old. Now her mother works as a housemaid to support Grace and her two younger siblings. Grace is the class captain and volunteers as a peer tutor for younger students. She believes education is the key to a better future.",
    school: "Kampala Day School",
    location: "Kampala, Uganda",
    needs: ["Education", "Basic needs", "Health & Nutrition support"],
    monthlyNeed: "$55/month",
    progress: 49,
    sponsorshipStatus: "Available",
  },
];

export const mockSponsorshipRecords: SponsorshipRecord[] = [
  {
    _id: "sponsorship-1",
    childId: "kid-1",
    childName: "Amina",
    donor: {
      id: "donor-1",
      name: "Grace Harper",
      email: "grace.harper@example.com",
      phone: "+256 701 234 567",
      location: "Kampala, Uganda",
    },
    plan: "School Sponsorship",
    monthlyAmount: 50,
    status: "Active",
    startDate: "2025-08-01",
    lastPayment: "2026-04-01",
    totalPaid: 800,
    payments: [
      {
        id: "payment-1",
        date: "2026-04-01",
        amount: 50,
        method: "Mobile Money",
        status: "Completed",
        receiptId: "REC-1001",
        note: "Monthly school fee",
      },
      {
        id: "payment-2",
        date: "2026-03-01",
        amount: 50,
        method: "Mobile Money",
        status: "Completed",
        receiptId: "REC-0987",
        note: "Monthly school fee",
      },
    ],
    notes: "Sponsor is committed to the full school year support plan.",
  },
  {
    _id: "sponsorship-2",
    childId: "kid-2",
    childName: "David",
    donor: {
      id: "donor-2",
      name: "John Carter",
      email: "john.carter@example.com",
      phone: "+256 701 987 654",
      location: "Mukono, Uganda",
    },
    plan: "Education & Food Support",
    monthlyAmount: 60,
    status: "Active",
    startDate: "2025-10-15",
    lastPayment: "2026-04-10",
    totalPaid: 1080,
    payments: [
      {
        id: "payment-3",
        date: "2026-04-10",
        amount: 60,
        method: "Bank Transfer",
        status: "Completed",
        receiptId: "REC-1102",
        note: "April sponsorship installment",
      },
      {
        id: "payment-4",
        date: "2026-03-10",
        amount: 60,
        method: "Bank Transfer",
        status: "Completed",
        receiptId: "REC-1063",
        note: "March sponsorship installment",
      },
    ],
    notes: "Donor prefers quarterly progress updates.",
  },
  {
    _id: "sponsorship-3",
    childId: "kid-4",
    childName: "Samuel",
    donor: {
      id: "donor-3",
      name: "Mariam Ochieng",
      email: "mariam.ochieng@example.com",
      phone: "+256 704 321 098",
      location: "Wakiso, Uganda",
    },
    plan: "Secondary School Support",
    monthlyAmount: 70,
    status: "Pending",
    startDate: "2026-01-05",
    lastPayment: "2026-01-05",
    totalPaid: 140,
    payments: [
      {
        id: "payment-5",
        date: "2026-01-05",
        amount: 70,
        method: "Cash",
        status: "Completed",
        receiptId: "REC-1040",
        note: "First sponsorship installment",
      },
      {
        id: "payment-6",
        date: "2025-12-05",
        amount: 70,
        method: "Cash",
        status: "Completed",
        receiptId: "REC-1031",
        note: "Initial pledge payment",
      },
    ],
    notes: "Pending renewal confirmation for the next term.",
  },
];

export const mockEvents: Event[] = [
  {
    _id: "1",
    title: "Community Health Outreach",
    date: "2026-04-12",
    description:
      "Free medical checkups, HIV testing, and health education for residents in underserved communities.",
    image: {
      url: "https://www.shutterstock.com/image-photo/outdoor-photo-healthcare-africa-260nw-2606488033.jpg",
      public_id: "unsplash/medical-africa-clinic",
    },
    time: "09:00 AM - 03:00 PM",
    topic: "Healthcare",
    location: {
      address: "Kireka Community Grounds, Wakiso District",
    },
  },
  {
    _id: "2",
    title: "Back to School Drive",
    date: "2026-05-03",
    description:
      "Distribution of school supplies including books, uniforms, and bags to children in need.",
    image: {
      url: "https://s3.amazonaws.com/cdn.micato.com/wp-content/uploads/2018/09/07233051/one-for-one-girls-2-1.jpg",
      public_id: "unsplash/african-children-school",
    },
    time: "10:00 AM - 02:00 PM",
    topic: "Education",
    location: {
      address: "St. Peter’s Primary School, Mukono",
    },
  },
  {
    _id: "3",
    title: "Youth Skills Training Workshop",
    date: "2026-05-20",
    description:
      "Empowering youth with practical skills in tailoring, baking, and basic computer literacy.",
    image: {
      url: "https://foodtank.com/wp-content/uploads/2018/07/CORAFYouth.jpg",
      public_id: "unsplash/african-youth-training",
    },
    time: "11:00 AM - 04:00 PM",
    topic: "Youth Empowerment",
    location: {
      address: "Nakawa Vocational Center, Kampala",
    },
  },
  {
    _id: "4",
    title: "Food Distribution Campaign",
    date: "2026-06-01",
    description:
      "Providing essential food packages to vulnerable families facing food insecurity.",
    image: {
      url: "https://www.syf-relief.com/donates/donate_8/70_africa-food01.jpg",
      public_id: "unsplash/food-donation-africa",
    },
    time: "08:30 AM - 01:00 PM",
    topic: "Hunger Relief",
    location: {
      address: "Nansana Town Council Grounds, Wakiso",
    },
  },
  {
    _id: "5",
    title: "Clean Water Initiative Launch",
    date: "2026-06-15",
    description:
      "Launching a borehole project to provide clean and safe drinking water to rural communities.",
    image: {
      url: "https://www.shutterstock.com/image-photo/two-black-hands-cupping-clean-260nw-2481638215.jpg",
      public_id: "unsplash/clean-water-africa",
    },
    time: "09:30 AM - 12:30 PM",
    topic: "Water & Sanitation",
    location: {
      address: "Luweero Village Center, Luweero District",
    },
  },
  {
    _id: "6",
    title: "Fundraising Gala Night",
    date: "2026-07-10",
    description:
      "An evening of networking, entertainment, and fundraising to support ongoing charity programs.",
    image: {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3e09xhkTmSrLvGdFt8y39BiQrCeoJ-fs6jw&s",
      public_id: "unsplash/gala-event-africa",
    },
    time: "06:00 PM - 10:00 PM",
    topic: "Fundraising",
    location: {
      address: "Serena Hotel, Kampala",
    },
  },
];

export const mockBlogs: Post[] = [
  {
    _id: "1",
    title: "The Impact of Community Health Programs in Rural Uganda",
    excerpt:
      "Exploring how grassroots health initiatives are transforming lives in underserved areas.",
    image: {
      url: "https://assets.weforum.org/article/image/large_3_m_K7GFWj4l2b_eibFXDCdnD_IedOoPnnQZigC81Xs.jpg",
      public_id: "unsplash/healthcare-africa",
    },
    content:
      "Community health programs have become one of the most effective ways to bridge the healthcare gap in rural Uganda. In many villages, access to hospitals and trained medical professionals remains limited due to distance, cost, and infrastructure challenges. As a result, preventable diseases often go untreated, leading to unnecessary suffering and loss of life. Community-based health initiatives are changing this narrative by bringing services closer to the people.\n\nOne of the key components of these programs is the use of community health workers. These are trained individuals from within the community who provide basic medical care, health education, and referrals to larger health facilities when necessary. Because they are trusted members of the community, they are able to effectively communicate important health messages and encourage positive behavioral changes. This includes promoting hygiene, encouraging vaccinations, and educating families about nutrition and disease prevention.\n\nMobile clinics are another powerful tool used in these programs. By traveling to remote areas on scheduled days, healthcare providers can offer services such as HIV testing, maternal care, and treatment for common illnesses. This approach significantly reduces the barriers that rural populations face when trying to access care. It also ensures that early diagnosis and treatment can take place, which is critical in improving health outcomes.\n\nPartnerships play a major role in the success of community health programs. Local leaders, government agencies, and nonprofit organizations often collaborate to ensure that resources are used efficiently and that programs are sustainable. These partnerships also help in scaling successful initiatives to reach more communities over time.\n\nDespite the progress made, challenges still exist. Limited funding, shortages of medical supplies, and logistical difficulties can hinder the effectiveness of these programs. However, continued investment and community involvement can help overcome these barriers.\n\nUltimately, community health programs are not just about providing medical care—they are about empowering communities to take charge of their own health. By focusing on prevention, education, and accessibility, these initiatives are creating lasting change and improving the quality of life for thousands of people across Uganda.",
    author: "Sarah Namusoke",
    date: "2026-02-10",
    status: "published",
    likes: ["user1", "user2", "user3"],
    views: ["ip1", "ip2", "ip3", "ip4"],
    comments: [
      {
        name: "John",
        comment: "This is truly impactful work!",
        commentedOn: "2026-02-11",
      },
    ],
  },
  {
    _id: "2",
    title: "Why Education Sponsorship Changes Everything",
    excerpt:
      "A look into how supporting one child’s education can uplift entire communities.",
    image: {
      url: "https://images.unsplash.com/photo-1473649085228-583485e6e4d7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWZyaWNhbiUyMHN0dWRlbnRzfGVufDB8fDB8fHww",
      public_id: "unsplash/education-africa",
    },
    content:
      "Education sponsorship programs have long been recognized as one of the most powerful tools for breaking the cycle of poverty. In many parts of Uganda, children face significant barriers to accessing education, including financial constraints, lack of school supplies, and long distances to schools. Sponsorship programs address these challenges by providing the necessary support for children to stay in school and succeed academically.\n\nWhen a child receives an education, the benefits extend far beyond the individual. Educated individuals are more likely to secure stable employment, contribute to the local economy, and make informed decisions about their health and wellbeing. This creates a ripple effect that positively impacts families and entire communities. For example, an educated parent is more likely to prioritize education for their own children, creating a cycle of opportunity that can span generations.\n\nSponsorship programs typically cover tuition fees, uniforms, books, and sometimes even meals. This comprehensive support ensures that children can focus on their studies without the burden of financial stress. In addition, many programs offer mentorship and counseling, helping students develop confidence and life skills that are essential for success.\n\nCommunity involvement is also a critical aspect of these programs. Local leaders, teachers, and parents often play an active role in monitoring the progress of sponsored children and ensuring that resources are used effectively. This sense of ownership helps to strengthen the program and ensures its sustainability.\n\nHowever, challenges remain. Limited funding means that not every child in need can be supported. Additionally, some communities still face cultural barriers that discourage education, particularly for girls. Addressing these challenges requires ongoing advocacy, awareness campaigns, and increased investment in education.\n\nIn conclusion, education sponsorship is more than just financial assistance—it is an investment in the future. By empowering children with knowledge and skills, these programs are helping to build stronger, more resilient communities and paving the way for long-term development.",
    author: "David Okello",
    date: "2026-01-28",
    status: "published",
    likes: ["user4", "user5"],
    views: ["ip5", "ip6"],
    comments: [
      {
        name: "Amina",
        comment: "Education is the key to everything.",
        commentedOn: "2026-01-29",
      },
    ],
  },
  {
    _id: "3",
    title: "Clean Water: A Basic Need Still Out of Reach",
    excerpt:
      "Millions still lack access to safe drinking water—here’s what’s being done.",
    image: {
      url: "https://content.unops.org/photos/News-and-Stories/News/_image1920x900/GettyImages-517346047.jpg",
      public_id: "unsplash/clean-water",
    },
    content:
      "Access to clean and safe drinking water is a fundamental human right, yet millions of people in Uganda and across Africa still struggle to obtain it. In many rural communities, families rely on unsafe water sources such as rivers, ponds, and unprotected wells. This exposes them to waterborne diseases such as cholera, dysentery, and typhoid, which can have devastating consequences.\n\nCharitable organizations and development partners have been working tirelessly to address this challenge through various initiatives. One of the most common approaches is the construction of boreholes and protected wells. These provide a reliable source of clean water that is accessible to the entire community. In addition, water purification systems and rainwater harvesting technologies are being introduced to further improve access.\n\nEducation plays a crucial role in ensuring the success of these initiatives. Communities are trained on proper hygiene practices, water storage, and maintenance of water facilities. This helps to prevent contamination and ensures that the benefits of clean water are sustained over time.\n\nWomen and children are often the most affected by water scarcity, as they are typically responsible for collecting water. In some cases, they have to walk several kilometers each day to reach the nearest water source. By bringing clean water closer to home, these initiatives not only improve health outcomes but also free up time for education and economic activities.\n\nDespite the progress made, challenges such as maintenance costs, population growth, and climate change continue to threaten water security. Addressing these issues requires a coordinated effort involving governments, NGOs, and local communities.\n\nUltimately, ensuring access to clean water is not just about infrastructure—it is about dignity, health, and opportunity. By investing in sustainable solutions, we can create a future where no one has to struggle for such a basic necessity.",
    author: "Grace Atim",
    date: "2026-03-01",
    status: "published",
    likes: ["user6"],
    views: ["ip7", "ip8", "ip9"],
    comments: [],
  },
];

export const mockCampaigns = [
  {
    id: "cmp_001",
    title: "Clean Water for Rural Families",
    tagline: "Bringing safe and reliable water sources closer to home.",
    description:
      "This campaign focuses on constructing and rehabilitating boreholes in underserved rural communities where families currently walk long distances to fetch unsafe water. The funds will support drilling, water testing, pump installation, and community maintenance training to ensure long-term access to clean water.",
    image: {
      url: "https://ob.org/wp-content/uploads/2024/10/clean-water-solutions-in-africa.jpg",
      public_id: "charity/campaigns/clean-water-rural-families",
    },
    goal: 25000,
    raised: 14350,
    endDate: "2026-06-30",
    status: "ongoing",
    donations: ["dn_1001", "dn_1002", "dn_1003", "dn_1004", "dn_1005"],
  },
  {
    id: "cmp_002",
    title: "Back to School for Every Child",
    tagline: "Supplying books, uniforms, and hope for vulnerable learners.",
    description:
      "This education campaign is designed to provide school supplies, uniforms, tuition support, and learning materials for children from low-income households. It aims to reduce absenteeism, improve academic confidence, and keep children in school throughout the academic year.",
    image: {
      url: "https://itvs.org/wp-content/uploads/2021/03/african_school-01-1.jpg",
      public_id: "charity/campaigns/back-to-school-every-child",
    },
    goal: 18000,
    raised: 9200,
    endDate: "2026-05-20",
    status: "upcoming",
    donations: ["dn_1006", "dn_1007", "dn_1008"],
  },
  {
    id: "cmp_003",
    title: "Emergency Food Relief Drive",
    tagline: "Delivering urgent food support to families in crisis.",
    description:
      "The Emergency Food Relief Drive raised funds to provide food packages to households affected by displacement, unemployment, and natural disasters. Each package includes staple foods, nutritional supplements, and basic hygiene items to support families through difficult periods.",
    image: {
      url: "https://www.amjamboafrica.com/wp-content/uploads/2022/07/image_6483441-2.jpg",
      public_id: "charity/campaigns/emergency-food-relief-drive",
    },
    goal: 30000,
    raised: 30120,
    endDate: "2026-02-28",
    status: "completed",
    donations: [
      "dn_1009",
      "dn_1010",
      "dn_1011",
      "dn_1012",
      "dn_1013",
      "dn_1014",
    ],
  },
  {
    id: "cmp_004",
    title: "Healthcare Outreach for Mothers",
    tagline: "Improving maternal care through mobile health services.",
    description:
      "This campaign supports mobile healthcare outreaches in remote communities, giving expectant and new mothers access to prenatal checkups, postnatal care, health education, and basic medicines. The project also helps local clinics with essential medical supplies and referral support.",
    image: {
      url: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
      public_id: "charity/campaigns/healthcare-outreach-mothers",
    },
    goal: 22000,
    raised: 11780,
    endDate: "2026-07-15",
    status: "ongoing",
    donations: ["dn_1015", "dn_1016", "dn_1017", "dn_1018"],
  },

  {
    id: "cmp_006",
    title: "Safe Shelter for Street Children",
    tagline: "Creating a secure place for healing, care, and growth.",
    description:
      "This campaign raises funds to expand temporary shelter services for street-connected children. Support will go toward bedding, meals, psychosocial care, protection services, and pathways to family reunification or long-term safe accommodation. The project aims to provide stability and dignity to children in extremely vulnerable situations.",
    image: {
      url: "https://media.licdn.com/dms/image/v2/C4E12AQHkava47RBuGg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1562846296010?e=2147483647&v=beta&t=e_p0lIiquTixH1_YteMF9S--H8J7jr9pLd0MFEUiC_U",
      public_id: "charity/campaigns/safe-shelter-street-children",
    },
    goal: 35000,
    raised: 18460,
    endDate: "2026-09-05",
    status: "upcoming",
    donations: ["dn_1019", "dn_1020", "dn_1021"],
  },
  {
    id: "cmp_007",
    title: "Tree Planting for a Greener Tomorrow",
    tagline: "Restoring communities through environmental action.",
    description:
      "This environmental campaign mobilizes volunteers, schools, and local leaders to plant indigenous trees in degraded areas and around public institutions. Donations will fund seedlings, transport, tools, community sensitization, and follow-up maintenance to improve long-term survival rates.",
    image: {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      public_id: "charity/campaigns/tree-planting-greener-tomorrow",
    },
    goal: 15000,
    raised: 7200,
    endDate: "2026-10-12",
    status: "upcoming",
    donations: ["dn_1022"],
  },
];
