# Automotive Database Schema

A normalized PostgreSQL/Supabase database schema designed to accurately model real-world automotive data relationships, including vehicles, owners, manufacturers, service records, and parts management.

## Demo Preview

![Demo GIF 1](demo/simba.gif)

![Demo GIF 2](demo/Demo.gif)

## Overview

This database schema provides a comprehensive foundation for managing automotive data with proper normalization, referential integrity, and query optimization. The design follows third normal form (3NF) principles to eliminate data redundancy while maintaining efficient query performance.

## Design Decisions

For a detailed explanation of design decisions and rationale, see **[DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)**.

**Key Design Principles:**
- **Normalization:** 3NF compliance to eliminate data redundancy
- **Integrity:** Foreign keys and constraints enforce business rules
- **Performance:** Strategic indexing for common query patterns
- **Flexibility:** Optional fields and extensible structure
- **Scalability:** UUID keys and normalized design support growth

## Database Structure

### Core Entities

#### 1. **Manufacturer**
Stores automotive brand and manufacturer information including company details, founding year, and headquarters location.

**Key Attributes:**
- `id`: Primary key (UUID)
- `name`: Unique manufacturer name
- `country`, `founded_year`, `headquarters`: Company information

#### 2. **Vehicle Model**
Represents specific vehicle models produced by manufacturers. Supports model year ranges and vehicle type classification.

**Key Attributes:**
- `id`: Primary key (UUID)
- `manufacturer_id`: Foreign key to Manufacturer (many-to-one)
- `name`: Model name
- `year_start`, `year_end`: Production year range
- `vehicle_type`: Classification (sedan, SUV, truck, etc.)

**Relationship:** Many Vehicle Models belong to one Manufacturer

#### 3. **Owner**
Stores customer, dealership, or fleet owner information. Supports multiple owner types through the `owner_type` field.

**Key Attributes:**
- `id`: Primary key (UUID)
- `first_name`, `last_name`: Owner identification
- `email`: Unique email address
- `owner_type`: Individual, dealership, or fleet
- Complete address fields for location tracking

**Relationship:** One Owner can have many Vehicles

#### 4. **Vehicle**
Core entity representing individual vehicles with VIN (Vehicle Identification Number) as the unique identifier.

**Key Attributes:**
- `id`: Primary key (UUID)
- `vin`: Unique 17-character Vehicle Identification Number
- `vehicle_model_id`: Foreign key to Vehicle Model
- `owner_id`: Foreign key to Owner
- `year`, `color`, `mileage`: Vehicle characteristics
- `status`: Current state (active, sold, totaled, stolen)
- Financial fields: `purchase_price`, `current_value`

**Relationships:**
- Many Vehicles belong to one Vehicle Model
- Many Vehicles belong to one Owner
- One Vehicle can have many Service Records

#### 5. **Service Center**
Represents service locations, dealerships, or repair shops where maintenance and repairs are performed.

**Key Attributes:**
- `id`: Primary key (UUID)
- `name`: Service center name
- Complete address and contact information

**Relationship:** One Service Center can have many Service Records and many Technicians

#### 6. **Technician**
Stores mechanic and technician information, including certifications and employment details.

**Key Attributes:**
- `id`: Primary key (UUID)
- `service_center_id`: Foreign key to Service Center (optional)
- `first_name`, `last_name`: Technician identification
- `certification_level`: Professional certifications (ASE, Master Technician, etc.)
- `status`: Employment status

**Relationship:** Many Technicians can belong to one Service Center

#### 7. **Service Record**
Tracks maintenance, repair, inspection, recall, and warranty service history for vehicles.

**Key Attributes:**
- `id`: Primary key (UUID)
- `vehicle_id`: Foreign key to Vehicle
- `service_center_id`: Foreign key to Service Center (optional)
- `technician_id`: Foreign key to Technician (optional)
- `service_date`: When service was performed
- `service_type`: Maintenance, repair, inspection, recall, or warranty
- `mileage_at_service`: Vehicle mileage at time of service
- `labor_cost`, `total_cost`: Financial tracking
- `warranty_covered`: Boolean flag for warranty services
- `next_service_due_date`, `next_service_due_mileage`: Service scheduling

**Relationships:**
- Many Service Records belong to one Vehicle
- Many Service Records can belong to one Service Center
- Many Service Records can be performed by one Technician
- One Service Record can use many Parts (through Service Part junction table)

#### 8. **Part**
Stores parts and component information used in vehicle services.

**Key Attributes:**
- `id`: Primary key (UUID)
- `part_number`: Unique part identifier
- `name`: Part name
- `manufacturer_name`: Part manufacturer (may differ from vehicle manufacturer)
- `category`: Part classification (engine, transmission, brake, etc.)
- `unit_price`: Current part price

**Relationship:** One Part can be used in many Service Records (many-to-many through Service Part)

#### 9. **Service Part** (Junction Table)
Implements the many-to-many relationship between Service Records and Parts, tracking which parts were used in each service and their quantities.

**Key Attributes:**
- `id`: Primary key (UUID)
- `service_record_id`: Foreign key to Service Record
- `part_id`: Foreign key to Part
- `quantity`: Number of parts used
- `unit_price`: Price at time of service (for historical accuracy)
- `total_price`: Calculated field (quantity × unit_price)

**Relationships:**
- Many Service Parts belong to one Service Record
- Many Service Parts reference one Part

## Relationship Logic

### One-to-Many Relationships

1. **Manufacturer → Vehicle Model**: Each manufacturer produces multiple vehicle models
2. **Vehicle Model → Vehicle**: Each model has many individual vehicles
3. **Owner → Vehicle**: Each owner can own multiple vehicles
4. **Service Center → Service Record**: Each service center performs many service records
5. **Service Center → Technician**: Each service center employs multiple technicians
6. **Technician → Service Record**: Each technician performs many service records
7. **Vehicle → Service Record**: Each vehicle has multiple service records over its lifetime

### Many-to-Many Relationships

1. **Service Record ↔ Part**: Services use multiple parts, and parts are used in multiple services
   - Implemented through the `service_part` junction table
   - Tracks quantity and pricing at time of service for historical accuracy

## Normalization Decisions

### Third Normal Form (3NF) Compliance

The schema is normalized to 3NF, eliminating:
- **Transitive dependencies**: Vehicle model information is separated from vehicle records
- **Partial dependencies**: All non-key attributes fully depend on primary keys
- **Data redundancy**: Manufacturer information is stored once and referenced

### Key Normalization Choices

1. **Separate Manufacturer and Vehicle Model Tables**
   - Prevents storing manufacturer details redundantly with each model
   - Allows efficient querying of all models by manufacturer
   - Supports manufacturer-level analytics

2. **Owner Table Separation**
   - Enables multiple vehicles per owner without duplicating owner information
   - Supports owner type classification (individual, dealership, fleet)
   - Facilitates owner-based reporting and communication

3. **Service Center and Technician Separation**
   - Allows technicians to be associated with service centers
   - Supports technician performance tracking
   - Enables service center capacity and workload analysis

4. **Service Part Junction Table**
   - Properly implements many-to-many relationship between services and parts
   - Stores historical pricing (unit_price at time of service)
   - Tracks quantities for inventory and cost analysis

5. **Calculated Fields**
   - `service_part.total_price` is a generated column (quantity × unit_price)
   - Ensures data consistency and reduces calculation errors

## Data Integrity

### Primary Keys
All tables use UUID primary keys for:
- Global uniqueness
- Security (non-sequential identifiers)
- Distributed system compatibility

### Foreign Keys
All relationships are enforced with foreign key constraints:
- `ON DELETE RESTRICT`: Prevents deletion of referenced records (manufacturer, vehicle model, owner, vehicle, part)
- `ON DELETE CASCADE`: Automatically removes dependent records (service records when vehicle is deleted)
- `ON DELETE SET NULL`: Allows optional relationships (technician, service center in service records)

### Constraints

1. **Unique Constraints**
   - VIN (Vehicle Identification Number) - globally unique
   - Manufacturer name
   - Owner email
   - Part number
   - Composite unique constraint on (manufacturer_id, name, year_start) for vehicle models

2. **Check Constraints**
   - Vehicle year: 1900 to current year + 1
   - Mileage: Non-negative values
   - Costs: Non-negative values
   - Status fields: Enumerated values (active, sold, etc.)
   - Service type: Enumerated values (maintenance, repair, etc.)
   - Owner type: Enumerated values (individual, dealership, fleet)

3. **Not Null Constraints**
   - Critical fields like VIN, vehicle model, owner, service date are required
   - Ensures data completeness

## Indexes for Query Optimization

Indexes are strategically placed on:

1. **Foreign Key Columns**: All foreign keys are indexed for join performance
2. **Unique Identifiers**: VIN, email, part numbers for fast lookups
3. **Common Query Fields**: 
   - Vehicle year, status, license plate
   - Service date, service type
   - Owner name, type
   - Part category, name
4. **Composite Indexes**: 
   - Owner name (last_name, first_name) for name searches
   - Service center location (city, state) for geographic queries

## Scalability Considerations

### Performance
- Indexes support common query patterns
- UUID primary keys prevent hot-spotting in distributed systems
- Normalized structure reduces storage requirements

### Extensibility
The schema can be extended to support:
- **Warranty Information**: Additional warranty table linked to vehicles
- **Insurance Records**: Insurance policy table with vehicle relationships
- **Accident History**: Accident records table
- **Recall Information**: Recall table linked to vehicle models
- **Inventory Management**: Stock levels and supplier information for parts
- **Appointment Scheduling**: Service appointment table
- **Customer Reviews**: Review/rating system for service centers and technicians

### Real-World Query Scenarios

The schema efficiently supports:

1. **Vehicle History Reports**
   - All service records for a specific VIN
   - Service cost history and trends
   - Parts replacement history

2. **Owner Management**
   - All vehicles owned by a customer
   - Service history across all owner vehicles
   - Owner contact information updates

3. **Service Center Analytics**
   - Revenue by service center
   - Technician workload and performance
   - Most common service types
   - Parts usage patterns

4. **Manufacturer Analysis**
   - Models by manufacturer
   - Service frequency by model
   - Common issues by vehicle model

5. **Inventory and Parts Management**
   - Parts used in services
   - Cost analysis by part category
   - Service center parts usage

6. **Maintenance Scheduling**
   - Vehicles due for service (by date or mileage)
   - Service reminders based on next_service_due fields

## Usage Instructions

### Installation

1. **Supabase Setup**
   - Create a new Supabase project
   - Navigate to SQL Editor
   - Copy and paste the contents of `schema.sql`
   - Execute the script

2. **PostgreSQL Setup**
   - Ensure PostgreSQL 12+ is installed
   - Create a new database
   - Execute `schema.sql` using psql or your preferred SQL client

### ERD Visualization

The ERD can be visualized using:
- **dbdiagram.io**: Import `erd.dbml` file
- **Supabase Studio**: Automatically generates ERD from schema
- **Other tools**: Convert DBML to your preferred format

### Sample Data

See `sample_data.sql` for example data inserts demonstrating the relationships and data structure.

### React Demo Application (Optional)

A complete React demo application is included in the `demo/` directory. This provides a user-friendly interface to interact with the database.

**Demo Screenshots:**

![Application Demo](demo/simba.gif)

![Application Demo](demo/Demo.gif)

**Quick Start:**
1. Navigate to the `demo/` directory
2. Copy `.env.example` to `.env` and add your Supabase credentials
3. Run `npm install` to install dependencies
4. Run `npm start` to launch the application

See `demo/README.md` for detailed setup instructions.

## File Structure

```
.
├── schema.sql           # Complete DDL script for database creation
├── erd.dbml            # ERD diagram in dbdiagram.io format
├── sample_data.sql     # Sample data insertion script
├── README.md           # This documentation file
└── demo/               # React demo application (optional bonus)
    ├── src/            # React source code
    ├── public/         # Public assets
    ├── package.json    # Node.js dependencies
    └── README.md       # Demo setup instructions
```

## Design Principles

1. **Normalization**: 3NF compliance to eliminate redundancy
2. **Referential Integrity**: Foreign keys with appropriate cascade rules
3. **Data Quality**: Constraints ensure valid data entry
4. **Performance**: Strategic indexing for common queries
5. **Extensibility**: Structure supports future enhancements
6. **Auditability**: Created/updated timestamps on all tables
7. **Flexibility**: Optional fields where appropriate, required fields where critical

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- UUID extension is required (enabled automatically in Supabase)
- Generated columns (like `total_price`) are stored for query performance
- The schema assumes US-based operations but can be adapted globally
- Service record pricing stores historical values for accurate cost tracking

## Deployment

The React demo application can be deployed to various hosting platforms so clients can access it without running it locally.

### Quick Deploy Options

**Vercel (Recommended):**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Set root directory to `demo`
5. Add environment variables (Supabase URL and key)
6. Deploy!

**Netlify:**
1. Push code to GitHub
2. Go to https://netlify.com
3. Import repository
4. Set base directory to `demo`
5. Add environment variables
6. Deploy!

See `DEPLOYMENT.md` for detailed deployment instructions.

### Live Demo

Once deployed, your app will be accessible at:
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://your-project.netlify.app`

Clients can access the full application with:
- Dashboard with statistics
- Vehicle, Owner, and Service Record management
- View and edit functionality
- No installation required!

## Future Enhancements

Potential additions to extend functionality:
- User authentication and authorization tables
- Audit logging for data changes
- Soft delete functionality
- Full-text search capabilities
- Geographic indexing for location-based queries
- Time-series data for vehicle telematics
- Integration with external APIs (VIN decoding, parts catalogs)

