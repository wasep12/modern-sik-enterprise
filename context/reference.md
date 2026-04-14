# Project Reference: Modern SIK Enterprise System

## Product Requirement Document (PRD)

**Nama Proyek:** Modern SIK Enterprise System  
**Tujuan:** Mendigitalisasi proses pengajuan izin kerja/akses gedung dengan sistem approval berjenjang yang transparan, cepat, dan mobile-first.

### Fitur Utama
- **Multi-Level Approval:** Alur dinamis (GSD Deputy -> Operation Dept Head -> GM/Director).
- **Real-time Dashboard:** Status pengajuan (Pending, Approved, Rejected) dengan pembaruan live.
- **Smart Notification:** Integrasi notifikasi sistem dan WhatsApp.
- **QR Code Generation:** Untuk verifikasi keamanan di lokasi setelah pengajuan disetujui.
- **Security Checkpoint:** Modul khusus untuk petugas keamanan melakukan scan dan verifikasi.

### User Experience (UX) Goals
- **Clean & Professional:** Whitespace cukup, tipografi fokus pada keterbacaan.
- **Adaptive Theme:** Support Dark Mode.
- **High Performance:** Lighthouse score > 90.

---

## Technical Design Document (TDD)

### Tech Stack & Architecture
- **Frontend:** React (Vite) + TypeScript.
- **Styling:** Tailwind CSS + Shadcn UI.
- **State Management:** TanStack Query & Zustand.
- **Real-time:** Simulated for demo (Supabase/Firebase in production).

### Clean Architecture (Folder Structure)
```text
src/
├── api/              # Integrasi API & Axios config
├── components/       # Atomic design
│   ├── ui/           # Shadcn UI components
│   └── shared/       # Reusable components
├── features/         # Modularisasi berdasarkan fitur
│   ├── approval/     # Logika approval
│   ├── request/      # Form pengajuan izin
│   └── dashboard/    # Statistik & monitoring
├── hooks/            # Global custom hooks
├── layouts/          # Dashboard & Auth layouts
├── lib/              # Utility
├── store/            # Global state (Zustand)
└── types/            # TypeScript interfaces/types
```

### Database Schema (High Level)
- **Requests Table:** `id, user_id, type, description, status, current_step`.
- **Approvals Table:** `id, request_id, approver_id, level (1,2,3), status, remarks`.
- **Logs Table:** Audit trail changes.

---

## Implementation Strategy
- **Performance First**: Code splitting, lazy loading, WebP images.
- **Strict Typing**: TypeScript without `any`.
- **Responsive**: Mobile-first Tailwind.
- **Dark Mode**: `next-themes` or internal logic.

### Logical Flow
1. **Input**: User mengisi form.
2. **Logic**: `Pending` -> Dashboard GSD Deputy.
3. **Branching**:
   - `Rejected` -> End.
   - `Approved` level 1 -> Dashboard Op Dept Head.
   - `Approved` level 2 -> Dashboard GM/Director.
   - `Approved` final -> Generate QR & Security Dashboard.
