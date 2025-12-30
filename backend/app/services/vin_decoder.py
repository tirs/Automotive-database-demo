"""Mock VIN Decoder Service.

Simulates NHTSA VIN decoding API with realistic mock data.
"""
import re
from typing import Optional
from app.schemas.vin import VINDecodeResponse, VINValidationResponse


# Mock manufacturer data based on VIN WMI (World Manufacturer Identifier)
MANUFACTURER_WMI = {
    "1G1": ("Chevrolet", "USA"),
    "1G6": ("Cadillac", "USA"),
    "1FA": ("Ford", "USA"),
    "1FM": ("Ford", "USA"),
    "1FT": ("Ford Truck", "USA"),
    "1GC": ("Chevrolet Truck", "USA"),
    "1GT": ("GMC Truck", "USA"),
    "1HD": ("Harley-Davidson", "USA"),
    "1HG": ("Honda", "USA"),
    "1J4": ("Jeep", "USA"),
    "1LN": ("Lincoln", "USA"),
    "1ME": ("Mercury", "USA"),
    "1N4": ("Nissan", "USA"),
    "2G1": ("Chevrolet", "Canada"),
    "2HG": ("Honda", "Canada"),
    "2T1": ("Toyota", "Canada"),
    "3FA": ("Ford", "Mexico"),
    "3VW": ("Volkswagen", "Mexico"),
    "4T1": ("Toyota", "USA"),
    "5FN": ("Honda", "USA"),
    "5TD": ("Toyota", "USA"),
    "5YJ": ("Tesla", "USA"),
    "JHM": ("Honda", "Japan"),
    "JN1": ("Nissan", "Japan"),
    "JT2": ("Toyota", "Japan"),
    "WAU": ("Audi", "Germany"),
    "WBA": ("BMW", "Germany"),
    "WDB": ("Mercedes-Benz", "Germany"),
    "WF0": ("Ford", "Germany"),
    "WVW": ("Volkswagen", "Germany"),
    "YV1": ("Volvo", "Sweden"),
    "ZFF": ("Ferrari", "Italy"),
}

# Mock model data
MOCK_MODELS = {
    "Chevrolet": ["Silverado", "Malibu", "Camaro", "Corvette", "Equinox", "Tahoe", "Suburban"],
    "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Focus", "Fusion", "Bronco"],
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series", "M3", "M5"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "GLC", "A-Class"],
    "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Gladiator", "Compass"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier", "Titan"],
    "Audi": ["A4", "A6", "Q5", "Q7", "e-tron", "RS6"],
    "Volkswagen": ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "ID.4"],
}

VEHICLE_TYPES = {
    "Silverado": "Truck",
    "F-150": "Truck",
    "Tacoma": "Truck",
    "Tundra": "Truck",
    "Frontier": "Truck",
    "Titan": "Truck",
    "Ridgeline": "Truck",
    "Gladiator": "Truck",
    "Camry": "Sedan",
    "Corolla": "Sedan",
    "Civic": "Sedan",
    "Accord": "Sedan",
    "Malibu": "Sedan",
    "Mustang": "Coupe",
    "Camaro": "Coupe",
    "Corvette": "Sports Car",
    "RAV4": "SUV",
    "CR-V": "SUV",
    "Explorer": "SUV",
    "Highlander": "SUV",
    "Pilot": "SUV",
    "X3": "SUV",
    "X5": "SUV",
    "Wrangler": "SUV",
    "Grand Cherokee": "SUV",
    "Model S": "Sedan",
    "Model 3": "Sedan",
    "Model X": "SUV",
    "Model Y": "SUV",
}


def _get_year_from_vin(vin: str) -> int:
    """Extract year from VIN position 10."""
    year_codes = {
        'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
        'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
        'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
        'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
        'Y': 2030,
        '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
        '6': 2006, '7': 2007, '8': 2008, '9': 2009,
    }
    if len(vin) >= 10:
        return year_codes.get(vin[9].upper(), 2020)
    return 2020


def _validate_vin_format(vin: str) -> tuple[bool, Optional[str]]:
    """Validate VIN format."""
    if len(vin) != 17:
        return False, "VIN must be exactly 17 characters"
    
    # VIN cannot contain I, O, Q
    if re.search(r'[IOQ]', vin.upper()):
        return False, "VIN cannot contain letters I, O, or Q"
    
    # Must be alphanumeric
    if not re.match(r'^[A-HJ-NPR-Z0-9]{17}$', vin.upper()):
        return False, "VIN must contain only valid alphanumeric characters"
    
    return True, None


def _get_mock_model(manufacturer: str, vin: str) -> str:
    """Get a deterministic model based on VIN."""
    models = MOCK_MODELS.get(manufacturer, ["Unknown Model"])
    # Use part of VIN to select model deterministically
    index = sum(ord(c) for c in vin) % len(models)
    return models[index]


class VINDecoderService:
    """Mock VIN decoder service."""
    
    async def decode(self, vin: str) -> VINDecodeResponse:
        """Decode a VIN and return vehicle information."""
        vin = vin.upper().strip()
        
        # Validate format
        is_valid, error = _validate_vin_format(vin)
        if not is_valid:
            return VINDecodeResponse(
                vin=vin,
                is_valid=False,
                error_message=error
            )
        
        # Get WMI (first 3 characters)
        wmi = vin[:3]
        
        # Look up manufacturer
        manufacturer_data = MANUFACTURER_WMI.get(wmi)
        if not manufacturer_data:
            # Try first 2 characters
            manufacturer_data = MANUFACTURER_WMI.get(wmi[:2] + vin[2])
        
        if manufacturer_data:
            manufacturer, plant_country = manufacturer_data
        else:
            # Default for unknown WMI
            manufacturer = "Unknown Manufacturer"
            plant_country = "Unknown"
        
        # Get year
        year = _get_year_from_vin(vin)
        
        # Get model
        model = _get_mock_model(manufacturer, vin)
        
        # Get vehicle type
        vehicle_type = VEHICLE_TYPES.get(model, "Sedan")
        
        # Generate other mock data based on VIN
        engine_sizes = ["2.0L", "2.4L", "2.5L", "3.0L", "3.5L", "3.6L", "5.0L", "5.7L"]
        fuel_types = ["Gasoline", "Diesel", "Hybrid", "Electric"]
        transmissions = ["6-Speed Automatic", "8-Speed Automatic", "CVT", "6-Speed Manual"]
        drive_types = ["FWD", "RWD", "AWD", "4WD"]
        
        vin_sum = sum(ord(c) for c in vin)
        
        # Tesla is always electric
        if manufacturer == "Tesla":
            fuel_type = "Electric"
            engine_size = "Electric Motor"
            transmission = "1-Speed Direct Drive"
        else:
            fuel_type = fuel_types[vin_sum % len(fuel_types)]
            engine_size = engine_sizes[vin_sum % len(engine_sizes)]
            transmission = transmissions[vin_sum % len(transmissions)]
        
        return VINDecodeResponse(
            vin=vin,
            manufacturer=manufacturer,
            model=model,
            year=year,
            vehicle_type=vehicle_type,
            body_class=vehicle_type,
            engine_size=engine_size,
            fuel_type=fuel_type,
            transmission=transmission,
            drive_type=drive_types[vin_sum % len(drive_types)],
            doors=4 if vehicle_type in ["Sedan", "SUV"] else 2,
            plant_city="Detroit" if plant_country == "USA" else "Various",
            plant_country=plant_country,
            is_valid=True
        )
    
    async def validate(self, vin: str) -> VINValidationResponse:
        """Validate a VIN and optionally decode it."""
        vin = vin.upper().strip()
        
        is_valid, error = _validate_vin_format(vin)
        
        if is_valid:
            decoded = await self.decode(vin)
            return VINValidationResponse(
                vin=vin,
                is_valid=True,
                decoded_data=decoded
            )
        
        return VINValidationResponse(
            vin=vin,
            is_valid=False,
            error_message=error
        )


# Singleton instance
vin_decoder_service = VINDecoderService()

