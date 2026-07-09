# iOS Tunnel Connection - Troubleshooting Guide

## 🔴 Masalah: "remote gone away" Error

**Penyebab:** Ngrok service (yang digunakan oleh Expo tunnel) sedang down atau tidak responsif.

**Status:** Cek https://status.ngrok.com/ untuk real-time status

---

## ✅ Solusi Alternatif (Recommended)

### Opsi 1: Gunakan Tailscale VPN (RECOMMENDED untuk Physical Device)

Tailscale adalah VPN gratis yang lebih reliable daripada Expo tunnel:

1. **Install Tailscale:**
   - Windows (Dev Machine): https://tailscale.com/download
   - iOS Device: Download dari App Store "Tailscale"

2. **Setup:**
   ```bash
   # Windows: Buka Tailscale dan login dengan GitHub/Google
   # iOS: Buka app dan connect ke same Tailscale account
   ```

3. **Jalankan Expo dengan LAN mode:**
   ```bash
   npm start -- --lan
   ```

4. **Scan QR code di iOS dengan Expo Go app**
   - Karena ketemunya via Tailscale VPN, semuanya sudah encrypted & connected

---

### Opsi 2: Setup EAS Development Build (Most Reliable untuk iOS)

Ini adalah setup paling reliable untuk iOS development:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login dengan Expo account
eas login

# Build development app
eas build --platform ios --profile preview

# Jalankan Expo start
npm start
```

---

### Opsi 3: Gunakan iOS Simulator (Jika punya Mac)

Paling simple & reliable untuk development:

```bash
# Mac only
npx expo start --ios
```

---

### Opsi 4: Wait & Retry Tunnel

Jika ingin stick dengan tunnel, tunggu hingga Ngrok recover:

```bash
# Cek status: https://status.ngrok.com/

# Retry dengan delay:
npm start -- --tunnel --clear

# Atau dengan debug info:
EXPO_TUNNEL_DEBUG=1 npm start -- --tunnel --clear
```

---

## 📝 Quick Setup untuk Test di Android (Alternative)

Kalau ada Android device yang bisa ditest lebih dulu:

```bash
npx expo start --lan
# Press A untuk open Android emulator
# Atau scan QR dengan Android device + Expo Go app
```

---

## 🔧 Configuration yang Sudah Dilakukan

✅ Fixed Babel preset version mismatch
✅ Installed react-native-worklets & reanimated
✅ Removed missing asset references dari app.json
✅ Configured .env.local untuk tunnel debug

---

## 💡 Recommended Next Steps

1. **Install Tailscale** di Windows & iOS
2. **Test dengan `--lan` mode**: `npm start -- --lan`
3. **Jika berhasil**, gunakan Tailscale untuk continuous development

---

**Updated:** 2026-07-08
