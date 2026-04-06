SCENES = overview hooks plugins_mcp skills agents
OUTPUT = output
MANIM = python3 -m manim
QUALITY = -ql --format=gif

.PHONY: all clean videos $(SCENES)

all: $(SCENES)

# Generate all per-item flow videos (reads from flows.json)
videos:
	python3 generate_all.py

$(SCENES):
	cd /Users/sebabreguel/personal/dotfiles/animations && $(MANIM) $(QUALITY) -o $@ scenes/$@.py $$(python3 -c "print(''.join(w.title() for w in '$@'.split('_')) + 'Scene')")
	mkdir -p $(OUTPUT) && mv media/videos/*/480p15/$@.gif $(OUTPUT)/ 2>/dev/null || mv media/videos/*/*/*/$@.gif $(OUTPUT)/

clean:
	rm -rf media $(OUTPUT)/*.gif
