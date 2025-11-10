# Automotive Database Demo - React Application

A React-based web application that demonstrates the Automotive Database Schema with a user-friendly interface for viewing vehicles, owners, and service records.

## Demo Preview

![Application Demo](simba.gif)

![Application Demo](Demo.gif)

## Features

- **Dashboard**: Overview statistics including total vehicles, owners, service records, and revenue
- **Vehicles View**: Browse all vehicles with manufacturer, model, owner, and status information
- **Owners View**: View owner details and their associated vehicles
- **Service Records View**: Track maintenance and repair history with detailed service information

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase project with the automotive database schema deployed

## Setup Instructions

### 1. Install Supabase Schema

First, ensure you have the database schema set up in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `../schema.sql`
4. Execute the script to create all tables

### 2. Load Sample Data (Optional)

To see the demo with sample data:

1. In Supabase SQL Editor, copy and paste the contents of `../sample_data.sql`
2. Execute the script to populate the database

### 3. Get Supabase Credentials

1. Go to your Supabase project settings
2. Navigate to API settings
3. Copy your Project URL and anon/public key

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Start the Development Server

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Project Structure

```
demo/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js      # Main dashboard with statistics
│   │   ├── Vehicles.js       # Vehicle listing component
│   │   ├── Owners.js         # Owner listing component
│   │   └── ServiceRecords.js # Service record listing component
│   ├── App.js                # Main app component with routing
│   ├── App.css               # Application styles
│   ├── supabaseClient.js     # Supabase client configuration
│   ├── index.js              # Application entry point
│   └── index.css             # Global styles
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Usage

### Navigation

Use the navigation bar at the top to switch between:
- **Dashboard**: Overview of database statistics
- **Vehicles**: View all vehicles in the database
- **Owners**: View all owners and their vehicles
- **Service Records**: View service history

### Viewing Data

All views display data from your Supabase database in real-time. The application uses Supabase's real-time capabilities, so changes to the database will be reflected in the UI.

## Supabase Row Level Security (RLS)

For production use, you should configure Row Level Security policies in Supabase. For development and demo purposes, you can temporarily disable RLS or create permissive policies.

To disable RLS for demo purposes (NOT recommended for production):

```sql
ALTER TABLE vehicle DISABLE ROW LEVEL SECURITY;
ALTER TABLE owner DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_record DISABLE ROW LEVEL SECURITY;
-- Repeat for other tables as needed
```

For production, create appropriate RLS policies based on your authentication requirements.

## Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` directory that can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Technologies Used

- **React 18**: UI framework
- **React Router**: Client-side routing
- **Supabase JS Client**: Database and API client
- **CSS3**: Styling with modern CSS features

## Troubleshooting

### "Invalid API key" error
- Verify your `.env` file has the correct Supabase URL and anon key
- Ensure the environment variables start with `REACT_APP_`

### "Table does not exist" error
- Make sure you've run the `schema.sql` script in your Supabase project
- Verify you're connected to the correct Supabase project

### No data showing
- Ensure you've run the `sample_data.sql` script if you want to see sample data
- Check that RLS policies allow reading from the tables
- Verify your Supabase project is active and accessible

## Next Steps

This is a basic demo application. You can extend it with:

- Add/Edit/Delete functionality for vehicles, owners, and service records
- Advanced filtering and search capabilities
- Charts and visualizations for analytics
- User authentication and authorization
- Export functionality (CSV, PDF)
- Real-time updates using Supabase subscriptions
- Mobile-responsive improvements

## License

This demo application is provided as part of the Automotive Database Schema project.

