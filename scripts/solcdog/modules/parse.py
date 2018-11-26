import re
import os

class FunctionInfo:
    name = None
    code = None
    args = None
    ret = None
    notice = None
    internal = None

    def __init__(self, name):
      self.name = name


class EventInfo:
    name = None
    notice = None


class ModifierInfo:
    name = None
    code = None
    notice = None

    def __init__(self, name):
      self.name = name


class ArgInfo:
    notice = None
    name = None
    type = None

    def __init__(self, _name, _type, _notice):
        self.name = _name
        self.type = _type
        self.notice = _notice


class MemberInfo:
    notice = None
    name = None
    type = None


class ParseInfo:
    title = None
    author = None
    contract_notice = None
    contract_name = None
    code = []
    functions = []
    enums = []
    events = []
    modifiers = []
    public_members = []
    parents = []


class Parser:
    info = ParseInfo()

    def parse(self, path):
        code = self.read_contract(path)
        self.code = code
        self.set_code(code)
        self.set_version(code)
        self.set_title(code)
        self.set_contract_author(code)
        self.set_contract(code)
        self.set_contract_notice(code)
        self.set_contract_parents(code)
        parent_contract_code = self.get_parent_code(code, path)
        contract_code = self.get_contract_code(code)
        self.set_function_list(contract_code + parent_contract_code)
        self.set_events(code + parent_contract_code)
        self.set_modifiers(code + parent_contract_code)
        self.set_public_members(contract_code + parent_contract_code)
        return self.info


    def read_contract(self, contract_path):
        with open(contract_path, 'r') as f:
            code = f.read()
            f.close()
            return code


    def get_contract_code(self, code):
        contract_definition = self.get_contract(code)
        if not contract_definition: return ""
        contract_body = self.get_body_code(contract_definition, code)
        body = ""
        for line in contract_body: body += line
        return body


    def get_parent_code(self, code, current_file_path):
        import_paths = re.findall(r'import "(.+)"', code)
        dirpath = os.path.dirname(current_file_path)
        all_parent_code = ""
        for path in import_paths:
            if not self.is_parent_contract(path): continue
            path_to_file = os.path.join(dirpath, path)
            parent_code = self.read_contract(path_to_file)
            all_parent_code += self.get_contract_code(parent_code)
        return all_parent_code


    def is_parent_contract(self, path):
        for parent in self.info.parents:
            if re.search(parent, path): return True
        return False


    def set_code(self, code):
        for line in code.splitlines():
            if not re.match(r"\s*///", line): self.info.code.append(line + '\n')


    def set_version(self, code):
        version = re.search(r"pragma solidity\s?\^?([\., \d]*)", code)
        if version: self.info.version = version.group(1)


    def set_title(self, code):
        title = re.search(r"/// @title (.+)", code)
        if title: self.info.title = title.group(1)


    def set_contract_author(self, code):
        author = re.search(r"@author (.+)", code)
        if author: self.info.author = author.group(1)


    def get_contract_name(self, code):
        contract_name = re.search(r"contract (\w+)\(?.*[\s, \n]{", code)
        return contract_name.group(1) if contract_name else None


    def get_contract(self, code):
        contract_name = re.search(r"(contract (\w+)\(?.*)[\s, \n]{", code)
        return contract_name.group(1) if contract_name else None


    def set_contract(self, code):
        self.info.contract_name = self.get_contract_name(code)


    def set_contract_parents(self, code):
        ret = re.search(r"contract " + self.info.contract_name + " is ([\w \,]+)", code)
        args = re.findall(r"(\w+)", ret.group(1)) if ret else []
        self.info.parents = args



    def get_notice(self, code):
        if not code: return None
        notice = re.search(r"@notice (.+)", code)
        return notice.group(1) if notice else None


    def get_args(self, code):
        return re.findall(r"@param (.+)", code)


    def get_arg_type(self, name, function):
        type = re.search("([\w\[\]]+) " + name, function)
        return type.group(1) if type else None


    def set_contract_notice(self, code):
        self.info.contract_notice = self.get_notice(code)


    def get_body_code(self, function, code):
        iterator = code.find(function) + len(function)
        while code[iterator] != '{': iterator += 1
        body_begin = iterator
        figure_amount = 1
        while figure_amount != 0:
            iterator += 1
            if code[iterator] == '{': figure_amount += 1
            if code[iterator] == '}': figure_amount -= 1
        body_end = iterator + 1
        body_code = code[body_begin:body_end].splitlines()
        readable_code = []
        for line in body_code:
            changed = re.search(r"    (.+)", line)
            readable_code.append((changed.group(1) if changed else line) + '\n')
        return readable_code


    def get_func_name(self, code):
        name = re.search(r"(\w+)\(", code)
        return name.group(1) if name else None


    def get_event_name(self, code):
        name = re.search(r"(\w+)\(", code)
        return name.group(1) if name else None


    def get_func_annotations(self, function, code):
        name = self.get_func_name(function)
        if name != None:
            annotations = re.search(r"((///(.+)[\s, \n]*)*)function " + name, code)
        else:
            annotations = re.search(r"((///(.+)[\s, \n]*)*)function \(", code)

        return annotations.group(1) if annotations else None


    def get_modifier_annotations(self, modifier, code):
        annotations = re.search(r"((///(.+)[\s, \n]*)*)modifier " + modifier, code)
        return annotations.group(1) if annotations else None


    def get_event_annotations(self, event, code):
        name = self.get_event_name(event)
        annotations = re.search(r"((///(.+)[\s, \n]*)*)event " + name, code)
        return annotations.group(1) if annotations else None


    def get_member_annotations(self, member, code):
        annotations = re.search(r"((///(.+)[\s, \n]*)*)" + re.escape(member), code)
        return annotations.group(1) if annotations else None


    def get_member_notice(self, type, name, code):
        definition = type + " public " + name
        annotations = self.get_member_annotations(definition, code)
        return self.get_notice(annotations)


    def get_function_notice(self, function, code):
        annotations = self.get_func_annotations(function, code)
        return self.get_notice(annotations)


    def get_modifier_notice(self, function, code):
        annotations = self.get_modifier_annotations(function, code)
        return self.get_notice(annotations)


    def get_event_notice(self, event, code):
        annotations = self.get_event_annotations(event, code)
        return self.get_notice(annotations)


    def get_function_ret(self, function, code):
        annotations = self.get_func_annotations(function, code)
        ret = re.search(r"@return (.+)", annotations)
        return ret.group(1) if ret else None


    def get_function_args(self, function, code):
        annotations = self.get_func_annotations(function, code)
        args = []
        for arg in self.get_args(annotations):
            ret = re.search("([\w]+) (.+)", arg)
            if ret: args.append(ArgInfo(ret.group(1), self.get_arg_type(ret.group(1), function), ret.group(2)))
        return args


    def set_function_list(self, code):
        function_list = re.findall(r"function (.+)[\s, \n]+{", code)
        for function in function_list:
            info = FunctionInfo(function)
            info.code = self.get_body_code(function, code)
            info.notice = self.get_function_notice(function, code)
            info.args = self.get_function_args(function, code)
            info.ret = self.get_function_ret(function, code)
            info.internal = function.find("internal") > -1
            info.private = function.find("private") > -1
            self.info.functions.append(info)


    def set_events(self, code):
        event_list = re.findall(r"event (.+);[\s, \n]+", code)
        for event in event_list:
            info = EventInfo()
            info.name = event
            info.notice = self.get_event_notice(event, code)
            self.info.events.append(info)


    def set_modifiers(self, code):
        modifier_list = re.findall(r"modifier (.+)", code)
        for modifier in modifier_list:
            info = ModifierInfo(modifier)
            info.code = self.get_body_code(modifier, code)
            info.notice = self.get_modifier_notice(modifier, code)
            self.info.modifiers.append(info)


    def set_public_members(self, code):
        member_list = re.findall(r"(.+) public (\w+);", code)
        for member in member_list:
            info = MemberInfo()
            info.type = member[0]
            info.name = member[1]
            info.notice = self.get_member_notice(info.type, info.name, code)
            self.info.public_members.append(info)
