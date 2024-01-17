#!/usr/bin/python

import glob

path = r'*.c'
files = glob.glob(path)

prefix="img_"

def get_lv_img_name(line):
    match_to="const lv_img_dsc_t "
    first=line[:len(match_to)]
    send=line[len(match_to):].index("=")
    name=line[len(match_to):len(match_to)+send-1]
    return name

def get_lv_img_name_in_file(file):
    with open(file, 'r') as ori_file:
        match_to="const lv_img_dsc_t "
        for line in ori_file:
            if line.startswith(match_to) :
                return get_lv_img_name(line)

for file in files:
    new_lines = ""
    with open(file, 'r') as ori_file:
        match_to="const lv_img_dsc_t "
        for line in ori_file:
            if line.startswith(match_to) :
                new_lines+=line[:len(match_to)]+prefix+get_lv_img_name(line)+" = {\n"
            else:
                new_lines+=line

    with open(file, 'w') as ori_file:
        ori_file.write(new_lines)

capi_map="./rust_assets/@img-assets.c"
new_lines=""
with open(capi_map, 'r') as ori_file:
        is_inserted=False
        match_begin_to="//@BEGIN_IMG_imgS@"
        match_end_to="//@END_IMG_imgS@"
        for line in ori_file:
            if line.startswith(match_begin_to) :
                is_inserted=True
                new_lines+=match_begin_to+"\n"
                for file in files:
                    new_lines+="#include \"%s\"\n" % file
            elif is_inserted and line.startswith(match_end_to) :
                is_inserted=False
                new_lines+=line
            elif is_inserted:
                pass
            else:
                new_lines+=line

with open(capi_map, 'w') as ori_file:
    ori_file.write(new_lines)
    
capi_map="./rust_assets/@img-assets.rs"
new_lines=""
with open(capi_map, 'r') as ori_file:
        is_inserted=False
        match_begin_to="//@BEGIN_IMG_imgS@"
        match_end_to="//@END_IMG_imgS@"
        for line in ori_file:
            if line.startswith(match_begin_to) :
                is_inserted=True
                new_lines+=match_begin_to+"\n"
                for file in files:
                    shortname=get_lv_img_name_in_file(file)
                    new_lines+="    impl_static_imgbin! (%s, %s);\n" % (shortname[len(prefix):], shortname)
            elif is_inserted and line.startswith(match_end_to) :
                is_inserted=False
                new_lines+=line
            elif is_inserted:
                pass
            else:
                new_lines+=line

with open(capi_map, 'w') as ori_file:
    ori_file.write(new_lines)
    
