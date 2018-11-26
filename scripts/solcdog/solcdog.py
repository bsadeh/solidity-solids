import sys
import os
sys.path.append(os.path.join(sys.path[0], 'modules'))


from cli import CLI
from gen import Generator


class Application:
    cli = None
    generator = None
    options = []

    contracts = []
    output = "solcdog.md"

    def __init__(self, cmd_input):
        self.cli = CLI(cmd_input)
        self.generator = Generator()
        self.fill_options()


    def fill_options(self):
        if self.cli.is_option("help") or self.cli.is_option("-h"): self.options.append("help")
        if self.cli.is_option("generate") or self.cli.is_option("-g"): self.options.append("generate")
        if self.cli.is_option("out") or self.cli.is_option("-o"): self.options.append("out")
        if self.cli.is_option("--no-code"): self.options.append("no-code")
        if len(self.options) == 0: self.options.append("help")


    def run(self):
        if "out" in self.options:
            self.output = self.cli.get_output()
            if self.output == "":
                self.cli.show_help()
                return False

        if "generate" in self.options:
            self.contracts = self.cli.get_contracts_list()
            if len(self.contracts) == 0:
                self.cli.show_help()
                return False

        if "no-code" in self.options:
            self.generator.set_generate_code_flag(False)

        if "help" in self.options:
            self.cli.show_help()

        if len(self.contracts) != 0:
            self.generator.set_output(self.output)
            self.generator.start(self.contracts)

        return True


app = Application(sys.argv)
app.run()
