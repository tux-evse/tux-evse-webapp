#!/usr/bin/bash
rm -f *.c
for img in $(ls /home/ronan/my_rp_builder_dir/gitsources/tux-evse/tux-evse-webapp/src/assets/images); do
    ../lv_img_conv.js /home/ronan/my_rp_builder_dir/gitsources/tux-evse/tux-evse-webapp/src/assets/images/${img} -f -c CF_TRUE_COLOR_ALPHA
done

./gen_tux_evse.py

mv *.c /home/ronan/my_rp_builder_dir/gitsources/tux-evse/display-binding-rs/lvgl-gui/assets


