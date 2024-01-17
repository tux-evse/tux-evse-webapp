#!/usr/bin/bash
rm -f *.c

cd ../../lv_img_conv/

for img in $(ls ../tux-evse-webapp/src/assets/images); do
    lv_img_conv.js ../tux-evse-webapp/src/assets/images/${img} -f -c CF_TRUE_COLOR_ALPHA
done

mv *.c ../tux-evse-webapp/rust_assets

cd -

./gen_tux_evse.py




