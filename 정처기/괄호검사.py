data = "()())"
top = -1
stack = []
for now in range(len(data)):
    if data[now] == "(":
        stack.append(now)
        top += 1
    else:
        if top != -1:
            stack.pop()
            top -= 1
        
        else:
            print("failed")
            break
        
    if top == -1 and now == len(data) - 1:
        print("success")
    elif top != -1 and now == len(data) - 1:
        print("failure")
    