import xml.etree.ElementTree as ET

def read_text_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    return lines

def convert_to_xml(data):
    root = ET.Element("root")
    
    for line in data:
        code, description = line.strip().split('\t')
        diag = ET.SubElement(root, "diag")
        name = ET.SubElement(diag, "name")
        name.text = code
        desc = ET.SubElement(diag, "desc")
        desc.text = description
    
    tree = ET.ElementTree(root)
    return tree

def write_xml_file(tree, output_path):
    with open(output_path, 'wb') as file:
        tree.write(file, encoding='utf-8', xml_declaration=True)

if __name__ == "__main__":

    input_file_path = './convert_to_xml/imrt_codes.txt'  # Change this to your input file path
    output_file_path = 'imrt_codes.xml'  # Change this to your desired output file path

    data = read_text_file(input_file_path)
    xml_tree = convert_to_xml(data)
    write_xml_file(xml_tree, output_file_path)
