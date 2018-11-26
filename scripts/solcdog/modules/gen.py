from parse import Parser

class Generator:

    output = None
    parser = None

    is_generate_code = True

    def __init__(self):
        self.parser = Parser()


    def set_generate_code_flag(self, is_generate_code):
        self.is_generate_code = is_generate_code


    def start(self, contracts):
        for contract_path in contracts:
            parse_info = self.parser.parse(contract_path)
            self.generate_documentation(parse_info)


    def set_output(self, output):
        self.output = output


    def gen_header(self, f, info):
        f.write("# " + info.contract_name + "\n")
        #f.write("\n`Solidity version " + info.version + "`\n")


    def gen_public_functions(self, f, info):
        f.write("\n#### Functions\n")
        for function in info.functions:
            if function.internal or function.private: continue
            f.write("- " + function.name + "\n")


    def gen_events(self, f, info):
        f.write("\n#### Events\n")
        for event in info.events:
            f.write("- " + event.name + "\n")
            #if event.notice != None: f.write("`Description:`\t" + event.notice + '\n\n')


    def gen_public_members(self, f, info):
        f.write("\n#### Members\n")
        for member in info.public_members:
            f.write("- " + member.name + " : " + member.type + "\n")
            #if member.notice != None: f.write("`Description:`\t" + member.notice + '\n\n')


    def generate_documentation(self, info):
        with open(self.output, 'w') as f:
            self.gen_header(f, info)
            self.gen_public_functions(f, info)
            self.gen_events(f, info)
            self.gen_public_members(f, info)
            f.close()
