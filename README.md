# Modern SIK Enterprise — Digital Authorization System

![Banner](https://img.shields.io/badge/Status-Production--Ready-emerald?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React_|_TS_|_Vite-blue?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/CSS-Tailwind_4.0-38b2ac?style=for-the-badge)

A premium, enterprise-grade Digital Authorization System (SIK) designed for high-security environments. This platform streamlines the process of requesting, approving, and verifying entry/exit permits with a focus on speed, security, and a stunning user experience.

---

## 🚀 Core Features

### 🏢 Digital Permit Lifecycle
- **Unified Request Portal**: Streamlined application form for staff permits with real-time validation and state persistence.
- **Multi-Level Approval Workflow**: Role-Based Access Control (RBAC) allowing Deputy, Operational Head, and GM/Director levels to review applications.
- **Dynamic Status Tracking**: Live updates on permit status (Pending, Approved, Rejected, Checked-In/Out).

### 🛡️ Security & Verification
- **QR Security Checkpoint**: Built-in high-performance QR scanner for security personnel to verify digital permits in milliseconds.
- **Manual ID Validation**: Fallback verification system for manual processing at guard post checkpoints.
- **Hardware-Accelerated Scans**: Utilizes device camera with optimized frames for low-light environments.

### 📊 Administrative Intelligence
- **Audit Trail**: Comprehensive activity logs tracking every action with IP, device, and browser metadata (ISO 27001 compliant logic).
- **User Management**: Granular RBAC control with the ability to delegate roles and manage personnel access.
- **Operational Dashboard**: Real-time KPI summaries showing permit distribution and peak traffic hours.

### 🎨 Premium User Experience
- **Fluid UI**: Powered by Framer Motion for micro-interactions and smooth layout transitions.
- **View Transitions API**: Seamless theme switching (Light/Dark) with modern ripple effects.
- **Mobile First**: Fully responsive design tailored for mobile verification and desktop administration.

---

## 🛠️ Technology Stack

- **Frontend**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/) (Newest Standards)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: SPA Rewrites configured for Vercel/Cloudflare
- **ID Generation**: Nanoid-based custom formatting

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
src/
├── components/        # Shared UI components (Shadcn, Theme, Dialogs)
├── features/          # Domain-driven modules
│   ├── admin/         # User Management & Activity Logs
│   ├── approval/      # Multi-level Approval Workflow
│   ├── auth/          # Authentication & Demo Profiles
│   ├── dashboard/     # Operations Overview
│   ├── request/       # Permit Application Form
│   └── security/      # QR Checkpoint & Verification
├── layouts/           # Dashboard & Auth Layouts
├── lib/               # Utilities & Helpers
├── store/             # Zustand Global State
└── types/             # TypeScript interfaces
```

---

## 🔒 Security Principles
Modern SIK Enterprise follows the **Zero Trust** architecture model:
- Every permit is verified by a unique secure ID/QR.
- Auditing is performed for both successful and failed access attempts.
- RBAC ensures users only see what their role explicitly permits.

---

> [!NOTE]
> Designed and Developed as a modern replacement for legacy paper-based SIK systems. Built with ❤️ for peak operational efficiency.
