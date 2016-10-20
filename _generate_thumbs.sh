#!/bin/bash

img_dirs=("images/presentations/" "images/writings/" "images/projects/", "images/photography/")
thumbnails_dir="thumbnails/"
img_sizes=("160" "320" "640" "1280")
force=false

# Allow a force to regenerate all files
if [ "$1" == "-f" ]; then
  force=true
fi

for img_dir in ${img_dirs[@]}; do
  # img_dir="images/"$1"/"
  mkdir -p $img_dir$thumbnails_dir
  wild_dir="$img_dir""*.*"
  for file in $wild_dir; do
    if [ "$wild_dir" != "$file" ]; then
      basefile=$(basename "$file")
      basefilename=$(basename "$file" | cut -d. -f1)
      basefileext="."$(basename "$file" | cut -d. -f2)
      sep="-"

      for img_size in ${img_sizes[@]}; do
        if [ ! -f  $img_dir$thumbnails_dir$basefilename$sep$img_size$basefileext ] || [ "$force" == "true" ]; then
          echo "Generating $basefilename$sep$img_size$basefileext"
          gm convert $file -resize $img_size  $img_dir$thumbnails_dir$basefilename$sep$img_size$basefileext
        fi
      done
    fi
  done
done
