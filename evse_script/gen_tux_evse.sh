#!/usr/bin/bash
rm -f *.c
for img in $(ls ../src/assets/images); do
    ../lv_img_conv.js ../src/assets/images/${img} -f -c CF_TRUE_COLOR_ALPHA
done

./gen_tux_evse.py

mv *.c ./rust_assets


