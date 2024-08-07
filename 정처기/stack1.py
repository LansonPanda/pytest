stack = []

for i in range(5):
    stack.append(i+1)

while stack:
    print(stack.pop())