linkapps: 
	    npm install && tsc main.ts && python main.py
	
clean:
	rm -rf __pycache__

cleanWindows:
	RD __pycache__