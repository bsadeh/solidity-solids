import re
import os

class CLI:
    cmd_input = []

    def __init__(self, cmd_input):
        self.cmd_input = cmd_input


    def get_cmd(self):
        return self.cmd_input


    def is_option(self, option):
        return option in self.cmd_input


    def is_path_to_sol(self, opt):
        return re.search(r".sol$", opt) != None      #TODO: opt = "a.solextracharacters" must be False


    def is_path_to_md(self, opt):
        return re.search(r".md$", opt) != None       #TODO: opt = "a.mdextracharacters" must be False


    def get_contracts_list(self):
        contracts = []
        for opt in self.cmd_input:
            if self.is_path_to_sol(opt): contracts.append(os.path.abspath(opt))
        return contracts


    def get_output(self):
        for opt in self.cmd_input:
            if self.is_path_to_md(os.path.abspath(opt)): return opt
        return ""

    def show_help(self):
       	print("USAGE: solcdog [OPTION]... [FILE]...")
        print("Generate solidity contract documentation in markdown format.\n")
        print("List of available options:")
        print("\t-g, generate\tfile .sol to generation")
        print("\t-h, help\tshows solcdog help")
        print("\t-o, out\t\tfile .md to write output documentation")
        print("\n\t--no-code \tgenerator doesn't make code in documentation")
