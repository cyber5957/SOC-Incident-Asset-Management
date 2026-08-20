import json

from pathlib import Path

import asyncio

class Asset:

    def __init__(self, asset_id, hostname, ip_address, owner, status):
        self.asset_id = asset_id
        self.hostname = hostname
        self.ip_address = ip_address
        self.owner = owner
        self.status = status

    @classmethod
    def Get_Base_Inputs(cls):
        print("\n----gathering general asset details----")
        asset_id = input("Enter Asset ID: ")
        hostname = input("Enter Hostname: ")
        ip_address = input("Enter IP Address: ")
        owner = input("Enter Owner: ")
        status = input("Enter Status: ")

        return asset_id,hostname,ip_address,owner,status

    def __str__(self):
        return f"Asset ID: {self.asset_id} | Hostname: {self.hostname} | Status: {self.status}"
   

class Laptop(Asset):
    def __init__(self, asset_id, hostname, ip_address, owner, status, operating_system, RAM , storage):
        super().__init__(asset_id, hostname, ip_address, owner, status)
        self.operating_system = operating_system
        self.ram = RAM
        self.storage = storage

    @classmethod 
    def laptop_specific_assets(cls):
        base_Details = Asset.Get_Base_Inputs()
        print("laptop specific details")
        os = input("enter os:- ")
        ram = input("enter ram:- ")
        storage = input("enter storage:- ")
        return cls(*base_Details, os , ram, storage)

    def to_dict(self):
        """Converts object attributes into a dictionary for clean JSON serialization."""
        return {
            "asset_id": self.asset_id,
            "hostname": self.hostname,
            "ip_address": self.ip_address,
            "owner": self.owner,
            "status": self.status,
            "operating_system": self.operating_system,
            "ram": self.ram,
            "storage": self.storage
        }

    def __str__(self):
        base_str = super().__str__()
        return f"{base_str} | OS: {self.operating_system} | RAM: {self.ram} | Storage: {self.storage}"



class Server(Asset):
    
    def __init__(self, asset_id, hostname, ip_address, owner, status, operating_system, ram , cpu_cores, server_role):
        super().__init__(asset_id, hostname, ip_address, owner, status)
        self.operating_system = operating_system
        self.ram = ram
        self.cpu_cores = cpu_cores
        self.server_role = server_role

    @classmethod
    def server_specific_assets(cls):
        base_Details = Asset.Get_Base_Inputs()
        print("collection server specific details")
        os = input("enter os:- ")
        ram = input("enter ram:- ")
        cpu_cores = input("enter cpu cores:- ")
        server_role = input("enter server role:- ")
        return cls(*base_Details, os, ram, cpu_cores, server_role)

    def to_dict(self):
            """Converts object attributes into a dictionary for clean JSON serialization."""
            return {
                "asset_id": self.asset_id,
                "hostname": self.hostname,
                "ip_address": self.ip_address,
                "owner": self.owner,
                "status": self.status,
                "operating_system": self.operating_system,
                "ram": self.ram,
                "cpu_cores" : self.cpu_cores,
                "server_role":self.server_role,
            }

    def __str__(self):
        base_str=  super().__str__()
        return f"{base_str} | os: {self.operating_system} | RAM: {self.ram} |CPU CORES: {self.cpu_cores} | SERVER ROLE: {self.server_role}"

class Firewall(Asset):
    def __init__(self, asset_id, hostname, ip_address, owner, status, vendor,model,firmware_version):
        super().__init__(asset_id, hostname, ip_address, owner, status)
        self.vendor = vendor
        self.model = model
        self.firmware_Version = firmware_version

    @classmethod
    def firewall_specific_details(cls):
        base_Details = Asset.Get_Base_Inputs()
        vendor = input("enter the vendor:- ")
        model = input("enter model:- ")
        firmware = input("enter firmware version:- ")
        return cls(*base_Details,vendor, model, firmware )

    def to_dict(self):
                """Converts object attributes into a dictionary for clean JSON serialization."""
                return {
                    "asset_id": self.asset_id,
                    "hostname": self.hostname,
                    "ip_address": self.ip_address,
                    "owner": self.owner,
                    "status": self.status,
                    "vendor": self.vendor,
                    "model": self.model,
                    "firmware_version": self.firmware_Version
                }

    def __str__(self):
        base_str = super().__str__()
        return f"{base_str}| vendor : {self.vendor} | model : {self.model} | firmware version: {self.firmware_Version} "


    

#make a folder/ laptop saving json code 
def save_asset(asset_obj):

    folder_path = Path("asset1")
    folder_path.mkdir(exist_ok=True)

    file_path = folder_path / "Laptop_assets.json"

    if file_path.exists():
        with open(file_path, "r") as file:
            assets = json.load(file)
    else:
        assets = []

    assets.append(asset_obj.to_dict())

    with open(file_path, "w") as file:
        json.dump(assets, file, indent=4)

    print(f"////----successfully saved to {file_path.resolve()}----////")

#server saving json code
def server_save_assets(asset_obj):
     folder_path = Path("asset1")
     folder_path.mkdir(exist_ok=True)


     file_path = folder_path / "server_Assets.json"

     if file_path.exists():
          with open(file_path, "r") as file:
               assets = json.load(file)
     else:
         assets = []

     assets.append(asset_obj.to_dict())

     with open(file_path, "w") as file:
          json.dump(assets, file, indent=4)

     print(f"////----successfully saved to {file_path.resolve()}----////")

# firewall saving json code 
def firewall_save_assets(asset_obj):
     folder_path = Path("asset1")
     folder_path.mkdir(exist_ok=True)


     file_path = folder_path / "firewall_Assets.json"

     if file_path.exists():
          with open(file_path, "r") as file:
               assets = json.load(file)
     else:
         assets = []

     assets.append(asset_obj.to_dict())

     with open(file_path, "w") as file:
          json.dump(assets, file, indent=4)

     print(f"////----successfully saved to {file_path.resolve()}----////")

#registering_Asset_type and asset registration by specific file name 
def asset_type():
    print("/////-----Please select the type of asset you want to Register-----/////")
    asset_Registration_Selection = input("""1: Laptop\n
2: Server\n
3: Firewall
>>>  """)

    if asset_Registration_Selection == "1" or asset_Registration_Selection.strip().lower()== "laptop":
         laptop_instance = Laptop.laptop_specific_assets()

         save_asset(laptop_instance)


    elif asset_Registration_Selection == "2" or asset_Registration_Selection.strip().lower()== "server":
             server_instance = Server.server_specific_assets()

             server_save_assets(server_instance)


    elif asset_Registration_Selection == "3" or asset_Registration_Selection.strip().lower() == "firewall":
      firewall_instance = Firewall.firewall_specific_details()

      firewall_save_assets(firewall_instance)
    
                
    else:
        print("////----Please select the type of asset that is given in the option---////")
        return


#search by attribute and key value
def search_Assets_laptop():
     print("////---- Enter the attribute and the value you want to search with----////") 
              
     def load_assets(): 
                  with open(Path("asset1")/"laptop_assets.json", "r") as file: 
                      assets = json.load(file) 
                  return assets 
          
     asset_load = load_assets() 
     attribute_input = input("Attribute >>> ").strip() 
     value_input = input("Value >>> ").strip() 
     found = False 
              
     for asset in asset_load: 
                  # FIX: If the element is a string, convert it to a dictionary
                  if isinstance(asset, str):
                      try:
                          asset = json.loads(asset)
                      except json.JSONDecodeError:
                          continue # Skip if it's completely malformed text
                          
                  # Safe lookup using .get() to prevent crashes
                  if isinstance(asset, dict):
                      if str(asset.get(attribute_input)) == value_input: 
                          print(asset) 
                          found = True 
                          
                  if not found: 
                   print(f"no matching assets {attribute_input} with value {value_input} were found ")


def search_Assets_server(): 
    print("////---- Enter the attribute and the value you want to search with----////") 
    
    def load_assets(): 
        with open(Path("asset1")/"server_assets.json", "r") as file: 
            assets = json.load(file) 
        return assets 

    asset_load = load_assets() 
    attribute_input = input("Attribute >>> ").strip() 
    value_input = input("Value >>> ").strip() 
    found = False 
    
    for asset in asset_load: 
        # FIX: If the element is a string, convert it to a dictionary
        if isinstance(asset, str):
            try:
                asset = json.loads(asset)
            except json.JSONDecodeError:
                continue # Skip if it's completely malformed text
                
        # Safe lookup using .get() to prevent crashes
        if isinstance(asset, dict):
            if str(asset.get(attribute_input)) == value_input: 
                print(asset) 
                found = True 
                
    if not found: 
        print(f"no matching assets {attribute_input} with value {value_input} were found ")


def search_Asset_firewall():
     print("////---- Enter the attribute and the value you want to search with----////") 
         
     def load_assets(): 
             with open(Path("asset1")/"firewall_assets.json", "r") as file: 
                 assets = json.load(file) 
             return assets 
     
     asset_load = load_assets() 
     attribute_input = input("Attribute >>> ").strip() 
     value_input = input("Value >>> ").strip() 
     found = False 
         
     for asset in asset_load: 
             # FIX: If the element is a string, convert it to a dictionary
             if isinstance(asset, str):
                 try:
                     asset = json.loads(asset)
                 except json.JSONDecodeError:
                     continue # Skip if it's completely malformed text
                     
             # Safe lookup using .get() to prevent crashes
             if isinstance(asset, dict):
                 if str(asset.get(attribute_input)) == value_input: 
                     print(asset) 
                     found = True 
                     
             if not found: 
              print(f"no matching assets {attribute_input} with value {value_input} were found ")
     
     



#resource viewing by searching 
def resource_Viewing_by_search():
     print("----//// welcome to the view assets by search \n")
     print("////----please select the asset type for searching please----////\n")
     asset_search_input = input("""1: Laptop
     2: server
     3: Firewall
     >>> """)

     if asset_search_input == "1" or asset_search_input.lower().strip() == "laptop":
          search_Assets_laptop()
     elif asset_search_input == "2" or asset_search_input.strip().lower() == "Server":
          search_Assets_server()
     elif asset_search_input == "3" or asset_search_input.strip().lower() == "Firewall":
          print("////----search Firewall assets by: ----//// ")


def resource_viewing_by_choice():
     print("////----select the type of viewing you want to do of the assets ----////")
     viewing_options = input("""1: view by searching :
2: just viewing by asset type
>>> """)
     if viewing_options == "1" or viewing_options.lower() == "view by searching":
          resource_Viewing_by_search()
     elif viewing_options == "2" or viewing_options.lower() == "just viewing by asset type":
          resource_viewing()
     else:
          print("////---please select the valid input to view your resources----////")
          return

#resource viewing
def resource_viewing():
    print("////---- Please select the resources to view ----////")
    asset_Viewing = input(""" 1: Laptop
2: Server
3: Firewall
>>>  """)

    if asset_Viewing == "1" or asset_Viewing.strip().lower() == "laptop":
        laptop_asset_path_view = Path("asset1") / "laptop_assets.json"
        if laptop_asset_path_view.exists():
         print("////----THE ASSETS EXISTS AND HERE ARE ITS CONTENTS/DATA----//// ")
        else:
         print("///---- the ASSETS does not exists, please register the asset first ----////")
         return
         
        with open(laptop_asset_path_view, "r") as file:
              lines = file.readlines()

        for line in lines:
              print(line.strip())
              
    
    elif asset_Viewing == "2" or asset_Viewing.strip().lower() == "server":
         Server_asset_path_view = Path("asset1") / "Server_Assets.json"
         if Server_asset_path_view.exists():
                  print("////----THE ASSETS EXISTS AND HERE ARE ITS CONTENTS/DATA----//// ")
         else:
                  print("///---- the ASSETS does not exists, please register the asset first ----////")
                  return
         
         with open(Server_asset_path_view, "r") as file:
                       lines= file.readlines()

         for line in lines:
             print(line.strip())
    
    elif asset_Viewing == "3" or asset_Viewing.strip().lower() == "firewall":
         Firewall_asset_path_view = Path("asset1") / "Firewall_Assets.json"
         if Firewall_asset_path_view.exists():
                  print("////----THE assets EXISTS AND HERE ARE ITS CONTENTS/DATA----//// ")
         else:
                  print("///---- the ASSETS does not exists, please register the assets first ----////")
                  return
         
         
         with open(Firewall_asset_path_view, "r") as file:
                       lines = file.readlines()

         for line in lines:
              print(line.strip())

    else:
         print("////----please select form the existing options----////")

#resource viewing by choice


'''def before_asset_update_authentication():
     async def main():
      print("---Authenticating---\n")
      await asyncio.sleep(2)
      print("---authenticated---")'''


def resource_asset_updating():
      print("////----welcome to updating asset section----////")

      with open(Path("asset1")/"laptop_assets.json", "r")as file:
           data_load = json.load(file)
           if len(data_load)> 0:
                print("////----the following are the available keys----////")
                print(list(data_load[0].keys()))

           else:
                print("the json file is empty")
                return
           
      asset_id_input = input("Enter Asset ID >>> ").strip()
      for laptop in data_load:

        if laptop["asset_id"] == asset_id_input:

            print("\n////---- ASSET FOUND ----////")

           
            for key, value in laptop.items():
                print(f"{key}: {value}")

            
            print("\n////---- Available Attributes ----////")

            for key in laptop.keys():
                print(f"- {key}")

            
            attribute_input = input(
                "\nEnter the attribute you want to update >>> "
            ).strip()

           
            if attribute_input in laptop:

                print("\nAttribute exists!")

                
                print(
                    f"Current value of {attribute_input}: "
                    f"{laptop[attribute_input]}"
                )

            else:
                print(f"Invalid attribute: {attribute_input}")

            break

      else:
        print(f"Asset ID {asset_id_input} was not found.")

#resource or asset updating
def resource_or_asset_before_updating():
    
    print("////----enter the asset type you want to update----////")
    asset_update_type = input("""1: laptop
    2: server
    3: firewall
    >>> """)

    if asset_update_type == "1" or asset_update_type.strip().lower() == "laptop":
         asset_id_input = input("enter the asset id: ")
         with open(Path("asset1")/"Laptop_assets.json", "r") as file:
            id_found = json.load(file)

         for user in id_found:
              if user["asset_id"] == asset_id_input:
                   print("found")

                   display_json = json.dumps(user, indent=4)
                   print(display_json)

                   break
         else:
              print(f"the {asset_id_input} was not found ")
    
#introduction section 
print("//////////------welcome to the soc incident and asset management system------/////////")\

authorization = input("please tell us who are you:- ")

#AUTHENTICATION OF THE USER 

if authorization.strip().lower() == "admin" or authorization.strip().lower() == "soc manager":
    print(F"WELCOME {authorization}")
else:
    print(f"SORRY {authorization} you don't have the access to the system \n and this action will be reported")
    exit()

#authentication function\ for now it is sleep only 
async def main():
    print("---Authenticating---\n")
    await asyncio.sleep(2)
    print("---authenticated---")

asyncio.run(main())

#work selection 
print("///////------ Please select the type of work you want to do -------///////")

work_selection = input("""1: Registering Assets \n
2:  View Your Resources \n
3: Update the Existing Assets \n
>>>  """)

if work_selection == "1" or work_selection.strip().lower() == "Registering Assets":
    asset_type()

elif work_selection == "2" or work_selection.strip().lower() == "View Your Resources":
    resource_viewing_by_choice()

elif work_selection == "3" or work_selection.strip().lower() == "Update The Existing Assets":
   # resource_or_asset_before_updating()
    resource_asset_updating()

