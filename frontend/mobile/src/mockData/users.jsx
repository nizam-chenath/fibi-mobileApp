// mockData/users.jsx
export const mockUsers = {
  'harvard-001': [
    {
      id: 'user-001',
      email: 'john.smith@harvard.edu',
      password: 'password123',
      firstName: 'John',
      lastName: 'Smith',
      department: 'Computer Science',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '+1-617-555-0101',
      institution: 'Harvard University',
    },
    {
      id: 'user-002',
      email: 'jane.doe@harvard.edu',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Doe',
      department: 'Biology',
      role: 'Researcher',
      avatar: 'https://i.pravatar.cc/150?img=5',
      phone: '+1-617-555-0102',
      institution: 'Harvard University',
    },
  ],
  'stanford-001': [
    {
      id: 'user-003',
      email: 'robert.wilson@stanford.edu',
      password: 'password123',
      firstName: 'Robert',
      lastName: 'Wilson',
      department: 'Engineering',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=3',
      phone: '+1-650-555-0201',
      institution: 'Stanford University',
    },
    {
      id: 'user-004',
      email: 'sarah.johnson@stanford.edu',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      department: 'Physics',
      role: 'Researcher',
      avatar: 'https://i.pravatar.cc/150?img=7',
      phone: '+1-650-555-0202',
      institution: 'Stanford University',
    },
  ],
  'bits-001': [
    {
      id: 'user-005',
      email: 'arjun.mehra@bits-pilani.ac.in',
      password: 'password123',
      firstName: 'Arjun',
      lastName: 'Mehra',
      department: 'Electrical Engineering',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=12',
      phone: '+91-11-4001-2001',
      institution: 'Birla Institute of Technology and Science, Pilani',
    },
  ],
  'jhu-001': [
    {
      id: 'user-006',
      email: 'melissa.hughes@jhu.edu',
      password: 'password123',
      firstName: 'Melissa',
      lastName: 'Hughes',
      department: 'Public Health',
      role: 'Researcher',
      avatar: 'https://i.pravatar.cc/150?img=16',
      phone: '+1-410-555-1102',
      institution: 'Johns Hopkins University',
    },
  ],
  'smu-001': [
    {
      id: 'user-007',
      email: 'darren.tan@smu.edu.sg',
      password: 'password123',
      firstName: 'Darren',
      lastName: 'Tan',
      department: 'Business Analytics',
      role: 'Researcher',
      avatar: 'https://i.pravatar.cc/150?img=24',
      phone: '+65-6789-0101',
      institution: 'Singapore Management University',
    },
  ],
  'mit-001': [
    {
      id: 'user-008',
      email: 'nora.kim@mit.edu',
      password: 'password123',
      firstName: 'Nora',
      lastName: 'Kim',
      department: 'Aerospace Engineering',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=32',
      phone: '+1-617-555-3300',
      institution: 'Massachusetts Institute of Technology',
    },
  ],
};

let userSequence = 100;

const tenantInstitutionMap = {
  'harvard-001': 'Harvard University',
  'stanford-001': 'Stanford University',
  'bits-001': 'Birla Institute of Technology and Science, Pilani',
  'jhu-001': 'Johns Hopkins University',
  'smu-001': 'Singapore Management University',
  'mit-001': 'Massachusetts Institute of Technology',
};

export const getAuthenticatedUser = (email, password, tenantId) => {
  const tenantUsers = mockUsers[tenantId] || [];
  return tenantUsers.find(
    (user) => user.email === email && user.password === password,
  );
};

export const registerUser = (payload, tenantId) => {
  const email = payload.email?.trim().toLowerCase();
  const password = payload.password?.trim();
  const firstName = payload.firstName?.trim();
  const lastName = payload.lastName?.trim();
  const role = payload.role?.trim() || 'Researcher';
  const department =
    payload.department?.trim() || 'New Research Initiatives';

  if (!email || !password || !firstName || !lastName) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const tenantUsers = mockUsers[tenantId] || [];
  const emailExists = tenantUsers.some(
    (user) => user.email.toLowerCase() === email,
  );

  if (emailExists) {
    return {
      success: false,
      error: 'An account with this email already exists',
    };
  }

  userSequence += 1;

  const newUser = {
    id: `user-${String(userSequence).padStart(3, '0')}`,
    email,
    password,
    firstName,
    lastName,
    department,
    role,
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
    phone: payload.phone || '',
    institution: tenantInstitutionMap[tenantId] || 'Fibi University',
  };

  mockUsers[tenantId] = [...tenantUsers, newUser];

  return {
    success: true,
    user: newUser,
  };
};


