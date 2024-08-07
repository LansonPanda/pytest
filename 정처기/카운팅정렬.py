data = [5,0,2,4,2,2,4,1]

c = [0] * len(data)

for i in range(len(data)):
    c[data[i]] = c[data[i]] + 1

for i in range(1, len(data)):
    c[i] += c[i-1]

print(c)