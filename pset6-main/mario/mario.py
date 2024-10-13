while True:
    try:
        height = int(input("Height: "))
        if (height >= 1) and (height <= 8):
            break
    except:
        print("", end="")

spaces = 1

for j in range(height):


    for spaces in range(height-j-1):
        print(" ", end="")

  
    for i in range(j+1):
        print("#", end="")

    print()
