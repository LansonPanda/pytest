import random 

Data = []
for i in range(10):
    Data.append(random.randint(0,10))
    
Data = [3,2,5,4,1]

def selectionSort(data):
    for pivot in range(len(data)-1):
        min = pivot
        for where in range(pivot+1, len(data)):
            if data[where] < data[min]:
                min = where
        data[pivot], data[min] = data[min], data[pivot]
    print(data)
selectionSort(Data)