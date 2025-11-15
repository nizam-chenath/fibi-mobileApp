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
};

let userSequence = 100;

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
    institution: tenantId?.includes('harvard')
      ? 'Harvard University'
      : tenantId?.includes('stanford')
        ? 'Stanford University'
        : 'Fibi University',
  };

  mockUsers[tenantId] = [...tenantUsers, newUser];

  return {
    success: true,
    user: newUser,
  };
};


