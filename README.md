# ❤️ Personal Health Tracker

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)

A professional, extremely secure, and aesthetically pleasing dual-purpose health dashboard designed for tracking your daily **Blood Glucose** and **Blood Pressure** readings. Built with a heavy focus on user privacy, modern UI/UX design, and instant PDF report generation.

---

## ✨ Key Features

- 🩸 **Glucose Tracking**: Log daily Accu-Chek readings along with meal references and contextual tags.
- 🫀 **Blood Pressure Tracking**: Monitor your Systolic, Diastolic, and Pulse metrics seamlessly.
- 📄 **Professional PDF Export**: Instantly generate a hospital-grade, multi-page medical PDF report containing your patient information and health history tables.
- 🔐 **Enterprise-Grade Security**: Powered by Supabase Auth with strict Row Level Security (RLS). Your data is cryptographically tied to your account and completely inaccessible to anyone else.
- 🎨 **Beautiful UI/UX**: Designed using Tailwind CSS with glassmorphism effects, smooth animations, and a polished dark mode interface.
- ⚡ **Real-time Engine**: Built on Next.js 14 App Router and Server Actions for a lightning-fast, cache-busting, real-time experience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Language**: TypeScript & TSX
- **Styling**: Tailwind CSS & Lucide Icons
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **PDF Generation**: jspdf & jspdf-autotable

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- A free account on [Supabase](https://supabase.com/)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-health-tracker.git
cd personal-health-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory of the project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Setup the Database
Go to your Supabase project's SQL Editor and run the following commands to initialize the tables and Row Level Security (RLS) policies:

<details>
<summary>Click here to view the SQL Setup Script</summary>

```sql
-- Create User Profiles Table
create table public.profiles (
  user_id uuid references auth.users primary key,
  name text,
  age integer,
  gender text,
  blood_group text,
  weight text,
  height text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile." on profiles for select using ( auth.uid() = user_id );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = user_id );
create policy "Users can update their own profile." on profiles for update using ( auth.uid() = user_id );

-- Create Glucose Readings Table
create table public.glucose_readings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  glucose_level integer not null,
  context_tag text not null,
  meal_reference text,
  hours_offset numeric,
  notes text,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.glucose_readings enable row level security;

create policy "Users can insert their own glucose readings." on glucose_readings for insert with check ( auth.uid() = user_id );
create policy "Users can view their own glucose readings." on glucose_readings for select using ( auth.uid() = user_id );
create policy "Users can update their own glucose readings." on glucose_readings for update using ( auth.uid() = user_id );
create policy "Users can delete their own glucose readings." on glucose_readings for delete using ( auth.uid() = user_id );

-- Create Blood Pressure Readings Table
create table public.blood_pressure_readings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  systolic integer not null,
  diastolic integer not null,
  pulse integer not null,
  context_tag text,
  notes text,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blood_pressure_readings enable row level security;

create policy "Users can insert their own bp readings." on blood_pressure_readings for insert with check ( auth.uid() = user_id );
create policy "Users can view their own bp readings." on blood_pressure_readings for select using ( auth.uid() = user_id );
create policy "Users can update their own bp readings." on blood_pressure_readings for update using ( auth.uid() = user_id );
create policy "Users can delete their own bp readings." on blood_pressure_readings for delete using ( auth.uid() = user_id );
```
</details>

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 👨‍💻 Developed By

Designed and Developed by **Usama Saifullah**.

If you found this project helpful, feel free to give it a ⭐ on GitHub!
