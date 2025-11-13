# Fibi Mobile App - Quick Start Guide

## 🚀 How to Build and Test Your Splash Screen

### Prerequisites
- Node.js installed (v18+)
- Android Studio installed
- Android SDK configured
- Device or emulator ready

### Step 1: Install Dependencies
```bash
cd frontend/mobile
npm install
```

### Step 2: Build the Android App
```bash
# This will automatically increment version and build
npm run android
```

Or manually:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
react-native run-android
```

### Step 3: Test the Splash Screen

#### First Launch (Full Experience)
1. Build and install the app
2. **Close the app completely** (swipe away from recent apps)
3. Tap the Fibi app icon
4. You will see:
   - ⚡ **Native splash** (instant green screen with logo)
   - 🎬 **Animated splash** (white blocks sliding with "Fibi" text)
   - 📱 **Login/Dashboard** (main app)

#### Development (Hot Reload)
- During development, you'll only see the animated React Native splash
- The native splash only appears on cold start

### What You Should See

```
📱 App Launch Sequence:

┌─────────────────────────────┐
│  TAP FIBI ICON             │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  INSTANT NATIVE SPLASH     │
│  • Green background         │
│  • Fibi logo centered       │
│  • 0-500ms duration         │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  ANIMATED RN SPLASH        │
│  • Block slides over "Fibi" │
│  • Text fades in            │
│  • "Loading..." appears     │
│  • ~2800ms duration         │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  MAIN APP                  │
│  • Login or Dashboard       │
└─────────────────────────────┘
```

## 🎨 Visual Timeline

```
Time     Native Layer              React Native Layer
─────────────────────────────────────────────────────
0ms      [Green + Logo shows]      [Loading...]
         ████████████████         
                                   
500ms    [Transition]              [RN Ready]
         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         
                                   
600ms    [Hidden]                  [Animation starts]
                                   ░░░░ "Fibi" ░░░░
                                   
1000ms                             [Block sliding]
                                   ████ Fibi ▓▓▓▓
                                   
1700ms                             [Text visible]
                                   Fibi
                                   Loading...
                                   
2800ms                             [Animation done]
                                   
3000ms                             [App content]
                                   [Login Screen]
```

## 🔧 Troubleshooting

### Splash Screen Not Showing
```bash
# Clean the build
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

### Animation Not Smooth
- Make sure you're testing on a real device or fast emulator
- Check that `useNativeDriver` is properly configured
- Verify no heavy operations during animation

### Native Splash Shows Wrong Color/Logo
```bash
# Verify resources
ls android/app/src/main/res/drawable/fibi.png
ls android/app/src/main/res/values/colors.xml

# If files are correct, clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

### App Shows White Screen
- Check React Native Metro bundler is running
- Verify all imports in RootNavigator.jsx
- Check console for JavaScript errors:
```bash
npx react-native log-android
```

## 📝 Customization Guide

### Change Splash Duration
Edit `src/screens/SplashScreen.jsx`:
```javascript
const timer = setTimeout(() => {
  onFinish?.();
}, 2800); // ← Change this number (milliseconds)
```

### Change Colors
Edit `android/app/src/main/res/values/colors.xml`:
```xml
<color name="fibi_green">#YOUR_COLOR_HERE</color>
```

### Change Logo
Replace files:
- `android/app/src/main/res/drawable/fibi.png`
- Make sure it's a PNG with transparency
- Recommended size: 512x512px

### Modify Animation
Edit `src/screens/SplashScreen.jsx`:
```javascript
// Change animation timing
Animated.timing(animatedValue, {
  toValue: 1,
  duration: 800, // ← Adjust duration
  easing: Easing.out(Easing.cubic), // ← Change easing
  useNativeDriver: false,
})
```

## 🧪 Testing Checklist

- [ ] Native splash appears instantly on app launch
- [ ] Native splash shows green background (#48BD92)
- [ ] Native splash shows Fibi logo centered
- [ ] Animated splash appears after native splash
- [ ] White block slides across "Fibi" text
- [ ] "Fibi" text fades in smoothly
- [ ] "Loading..." text appears below
- [ ] Total animation takes ~2.8 seconds
- [ ] App content loads after animation
- [ ] No white flashes between transitions
- [ ] Status bar color matches splash background
- [ ] Animation is smooth (60fps)

## 🐛 Debug Commands

```bash
# View Android logs
npx react-native log-android

# View app info
adb shell dumpsys package com.thinkal

# Clear app data
adb shell pm clear com.thinkal

# Reinstall app
npm run android

# Check if splash screen library is linked
npx react-native info

# Metro bundler
npm start

# Build release APK
cd android
./gradlew assembleRelease
```

## 📦 Build for Production

### Generate Release APK
```bash
cd android
./gradlew assembleRelease
```

APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Install Release Build
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 🎯 Performance Tips

1. **Keep splash simple**: Current implementation is optimal
2. **Use native driver**: Already configured for smooth animations
3. **Preload resources**: Logo is embedded in native resources
4. **Minimize JS**: Splash runs mostly on native thread
5. **Test on real device**: Always test final build on actual hardware

## 📱 Platform Versions

- **Minimum Android:** API 24 (Android 7.0)
- **Target Android:** API 35 (Android 15)
- **React Native:** 0.77.0
- **React:** 18.3.1

## 🎉 Success Indicators

You've successfully implemented the splash screen when you see:

1. ✅ Instant green screen on app launch
2. ✅ Fibi logo appears immediately
3. ✅ Smooth transition to animated splash
4. ✅ Beautiful block animations
5. ✅ Text fades in elegantly
6. ✅ Seamless transition to app content
7. ✅ No white flashes or glitches
8. ✅ Consistent branding throughout

## 🆘 Support

If you encounter issues:

1. Check `SPLASH_SCREEN_SETUP.md` for detailed documentation
2. Review `ANIMATION_COMPARISON.md` for HTML vs RN comparison
3. Check Android logs: `npx react-native log-android`
4. Verify all files are in correct locations
5. Clean and rebuild the project

---

**Congratulations! Your Fibi mobile app now has a professional splash screen experience!** 🎊

Run `npm run android` and see it in action!


