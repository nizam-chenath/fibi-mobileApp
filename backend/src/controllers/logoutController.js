const logout = async (req, res) => {
  try {
    // Clear all possible authentication cookies
    const cookieNames = ['accessToken', 'token', 'Cookie_Token'];
    
    cookieNames.forEach(cookieName => {
      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    return res.status(200).json({ 
      message: 'User logged out successfully',
      cookiesCleared: cookieNames
    });
  } catch (error) {
    console.error('Error in logout:', error);
    return res.status(500).json({ 
      message: 'Error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { logout };