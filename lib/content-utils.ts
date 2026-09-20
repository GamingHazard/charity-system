export interface ContentItem {
  id: string;
  title: string;
  section: string;
  content: string;
  lastUpdated: string;
  status: 'published' | 'draft';
  createdAt?: string;
}

export function normalizeContentItem(item: ContentItem & { updatedAt?: string; _id?: string }): ContentItem {
  return {
    ...item,
    id: item.id || item._id || `content-${Date.now()}`,
    lastUpdated: item.updatedAt ? item.updatedAt.split('T')[0] : item.lastUpdated,
    createdAt: item.createdAt ? item.createdAt.split('T')[0] : item.createdAt,
  };
}

export const CONTENT_SECTIONS = [
  'Home',
  'About',
  'Programs',
  'Get Involved',
  'Contact',
];

export const defaultContentItems: ContentItem[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    section: 'Home',
    content: 'Planting Seeds of Love & Hope - Empowering communities through education, nutrition, and sustainable development. One seed at a time.',
    lastUpdated: '2024-03-10',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 'hero-subtitle',
    title: 'Hero Subtitle',
    section: 'Home',
    content: 'Empowering communities through education, nutrition, and sustainable development. One seed at a time.',
    lastUpdated: '2024-03-10',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 'about',
    title: 'About Us',
    section: 'About',
    content: 'Founded in 2015, Seeds of Love Foundation has been at the forefront of creating sustainable change in communities across Africa. We believe that education and proper nutrition are the seeds to unlock potential in every child.',
    lastUpdated: '2024-03-08',
    status: 'published',
    createdAt: '2024-01-20',
  },
  {
    id: 'mission',
    title: 'Mission Statement',
    section: 'About',
    content: 'To empower individuals and communities by providing access to quality education, nutritious food, and sustainable development opportunities that transform lives and create lasting positive change.',
    lastUpdated: '2024-03-05',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 'vision',
    title: 'Vision Statement',
    section: 'About',
    content: 'A world where every child has access to quality education and nutrition, enabling them to reach their full potential and contribute meaningfully to their communities.',
    lastUpdated: '2024-03-05',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 'cta-primary',
    title: 'Primary CTA',
    section: 'Home',
    content: 'Get Involved Today - Make a lasting impact by supporting our programs. Your contribution helps us reach more children and communities in need.',
    lastUpdated: '2024-03-09',
    status: 'draft',
    createdAt: '2024-02-01',
  },
  {
    id: 'donate-info',
    title: 'Donation Page Intro',
    section: 'Get Involved',
    content: 'Your support makes a real difference. Every donation, regardless of size, helps us expand our programs and reach more children in need of education and nutrition support.',
    lastUpdated: '2024-03-07',
    status: 'published',
    createdAt: '2024-01-25',
  },
  {
    id: 'volunteer-info',
    title: 'Volunteer Information',
    section: 'Get Involved',
    content: 'Join our team of dedicated volunteers. We offer flexible opportunities to contribute your time and skills to our various programs and initiatives.',
    lastUpdated: '2024-03-06',
    status: 'published',
    createdAt: '2024-02-05',
  },
  {
    id: 'programs-intro',
    title: 'Programs Page Introduction',
    section: 'Programs',
    content: 'Our comprehensive programs are designed to address the most pressing challenges in education and nutrition. Each program is tailored to meet the specific needs of the communities we serve.',
    lastUpdated: '2024-03-04',
    status: 'published',
    createdAt: '2024-02-10',
  },
  {
    id: 'contact-intro',
    title: 'Contact Page Introduction',
    section: 'Contact',
    content: 'We would love to hear from you. Please reach out with any questions, inquiries, or opportunities to collaborate. Our team is here to help.',
    lastUpdated: '2024-03-03',
    status: 'published',
    createdAt: '2024-02-15',
  },
];

export function searchContent(
  items: ContentItem[],
  searchTerm: string,
  section: string,
  status: string
): ContentItem[] {
  return items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = section === 'All' || item.section === section;
    const matchesStatus = status === 'All' || item.status === status;
    return matchesSearch && matchesSection && matchesStatus;
  });
}

export function sortContent(items: ContentItem[], sortBy: 'updated' | 'created' | 'title'): ContentItem[] {
  const sorted = [...items];
  if (sortBy === 'updated') {
    return sorted.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  } else if (sortBy === 'created') {
    return sorted.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export function exportContentAsJSON(items: ContentItem[]): string {
  return JSON.stringify(items, null, 2);
}

export function getContentStats(items: ContentItem[]) {
  return {
    total: items.length,
    published: items.filter(item => item.status === 'published').length,
    draft: items.filter(item => item.status === 'draft').length,
    bySection: items.reduce((acc, item) => {
      acc[item.section] = (acc[item.section] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
