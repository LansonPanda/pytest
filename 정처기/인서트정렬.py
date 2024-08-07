import random 

Data = []
for i in range(10):
    Data.append(random.randint(0,10))
Data = [3,2,5,4,1]
def insertSort(data):
    count = 0
    for i in range(1, len(data)):
        count+=1
        key = data[i]
        for j in range(i, 0, -1):
            if data[j-1] > key:
                data[j] = data[j-1]
                if j == 1:
                    data[j-1] = key
                    break
            else:
                data[j] = key
                break
                
    print(count)

                
insertSort(Data)