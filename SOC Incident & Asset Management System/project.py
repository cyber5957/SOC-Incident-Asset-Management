
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

    def __str__(self):
        base_str = super().__str__()
        return f"{base_str}| vendor : {self.vendor} | model : {self.model} | firmware version: {self.firmware_Version} "

#make a folder
from pathlib import Path

asset1 = Path("asset_main_directory")

asset1.mkdir(exist_ok=True)


#registering_Asset_type and asset registration by specific file name 
def asset_type():
    print("/////-----Please select the type of asset you want to Register-----/////")
    asset_Registration_Selection = input("""1: Laptop\n
2: Server\n
3: Firewall
>>>  """)

    if asset_Registration_Selection == "1" or asset_Registration_Selection.strip().lower()== "laptop":
         Laptop_result_dict = {}
         filename = "Laptop_assets.txt"
         file_path = asset1/ filename
         with open(file_path, "a") as file:
          file.write(f"{Laptop.laptop_specific_assets()} \n")
          print(f"////----successfully saved to {file_path.resolve()}----////")
         
         with open(file_path, "r") as file:
            for line in file:
             if not line.strip():
                continue
         
             attributes = line.strip().split("|")
             for attribute in attributes:
              if ":" in attribute:
                              
               key,Value = attribute.split(":",1)               
               Laptop_result_dict[key.strip()] = Value.strip()
            

    elif asset_Registration_Selection == "2" or asset_Registration_Selection.strip().lower()== "server":
             server_result_dict = {}
             filename = "Server_assets.txt"
             file_path = asset1/ filename
             with open(file_path, "a") as file:
                    file.write(f"{Server.server_specific_assets()} \n") 
                    print(f"////----successfully saved to {file_path.resolve()}----////")

             with open(file_path, "r") as file:
                for line in file:
                    if not line.strip():
                     continue

                    attributes = line.strip().split("|")
                    for attribute in attributes:
                      if ":" in attribute:
                     
                       key,Value = attribute.split(":",1)
                       server_result_dict[key.strip()] = Value.strip()

    
    elif asset_Registration_Selection == "3" or asset_Registration_Selection.strip().lower()== "firewall":
             firewall_result_dict = {}
             filename = "Firewall_assets.txt"
             file_path = asset1/ filename
             with open(file_path, "a") as file:
                    file.write(f"{Firewall.firewall_specific_details()} \n")
                    print(f"////----successfully saved to {file_path.resolve()}----////")

             with open(file_path, "r") as file:
                for line in file:
                 if not line.strip():
                  continue
                    
                 attributes = line.strip().split("|")
                 for attribute in attributes:
                  if ":" in attribute:
                                     
                   key,Value = attribute.split(":",1)                
                   firewall_result_dict[key.strip()] = Value.strip()
                

    else:
        print("////----Please select the type of asset that is given in the option---////")
        return


#resource viewing by searching 
def resource_Viewing_by_search():
     print("----//// welcome to the view assets by search \n")
     print("////----please select the asset type for searching please----////\n")
     asset_search_input = input("""1: Laptop
     2: server
     3: Firewall
     >>> """)

     if asset_search_input == "1" or asset_search_input.lower().strip() == "laptop":
          print("////----search laptop assets by: ----//// ")
     elif asset_search_input == "2" or asset_search_input.strip().lower() == "Server":
          print("////----search Server assets by: ----//// ")
     elif asset_search_input == "3" or asset_search_input.strip().lower() == "Firewall":
          print("////----search Firewall assets by: ----//// ")


#resource viewing
def resource_viewing():
    print("////---- Please select the resources to view ----////")
    asset_Viewing = input(""" 1: Laptop
2: Server
3: Firewall
>>>  """)

    if asset_Viewing == "1" or asset_Viewing.strip().lower() == "laptop":
        laptop_asset_path_view = Path("asset_main_directory") / "laptop_assets.txt"
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
         Server_asset_path_view = Path("asset_main_directory") / "Server_assets.txt"
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
         Firewall_asset_path_view = Path("asset_main_directory") / "Firewall_assets.txt"
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
        



#resource or asset updating
def resource_or_asset_updating():
    pass


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
import asyncio

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
    resource_viewing()

elif work_selection == "3" or work_selection.strip().lower() == "Update The Existing Assets":
    resource_or_asset_updating()
