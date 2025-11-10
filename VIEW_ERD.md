# How to View the ERD Diagram

The `erd.dbml` file contains your database schema in DBML (Database Markup Language) format. Here are several ways to view it:

## Method 1: Supabase Studio (Built-in ERD Viewer) - RECOMMENDED

Since you're using Supabase, this is the easiest method:

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to: https://app.supabase.com/project/YOUR_PROJECT_ID

2. **Access the ERD**
   - In the left sidebar, click **"Database"**
   - Click **"Tables"** (or it may show automatically)
   - Look for a **"Diagram"** tab or icon (usually at the top)
   - OR click the **"ERD"** or **"View Diagram"** button

3. **View Your Schema**
   - Supabase automatically generates an ERD from your database
   - Shows all tables with relationships
   - Interactive - you can zoom, pan, and click on tables
   - Updates automatically when you modify your schema

**Note:** The ERD in Supabase is generated from your actual database, so make sure you've run `schema.sql` first!

**Alternative Path:**
- Sometimes the ERD is under "Database" > "Schema Visualizer"
- Or look for a "Relationships" or "Diagram" view option

## Method 2: dbdiagram.io (For Standalone Viewing)

1. **Go to dbdiagram.io**
   - Open your browser
   - Navigate to: https://dbdiagram.io

2. **Import the file**
   - Click "Import" button (top right)
   - Select "Import from File"
   - Choose `erd.dbml` from your project folder
   - OR copy the entire contents of `erd.dbml` and paste it into the editor

3. **View the diagram**
   - The ERD will render automatically
   - You can zoom, pan, and interact with it
   - Click on tables to see details

4. **Export options** (if needed)
   - Click "Export" button
   - Choose format: PNG, PDF, or SVG
   - Download for documentation

## Method 3: VS Code Extension

If you use VS Code:

1. **Install DBML Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "DBML"
   - Install "DBML Language" extension

2. **View in VS Code**
   - Open `erd.dbml` file
   - Right-click and select "Preview DBML"
   - Or use the preview command

## Method 4: Online DBML Viewer (For erd.dbml file)

1. **Use online tools**
   - Go to: https://dbml.dbdiagram.io/home
   - Paste the contents of `erd.dbml`
   - View the diagram instantly

## Quick Steps for dbdiagram.io:

1. Copy the entire contents of `erd.dbml`
2. Go to https://dbdiagram.io
3. Click "New Project" or use the editor
4. Paste the DBML code
5. The diagram appears automatically!

## What You'll See

The ERD shows:
- All 9 tables (manufacturer, vehicle_model, vehicle, owner, etc.)
- Relationships between tables (one-to-many, many-to-many)
- Primary keys and foreign keys
- Table structures and fields

## Tips

- **Supabase Studio** is the best option if you've deployed your schema - it shows your actual database structure
- **dbdiagram.io** is great for viewing/editing the `erd.dbml` file or creating documentation
- Supabase ERD updates automatically when you modify your database
- You can export diagrams from dbdiagram.io as PNG/PDF for documentation
- Both methods show relationships, keys, and table structures clearly

