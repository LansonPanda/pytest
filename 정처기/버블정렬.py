import random as r

Data = []
for i in range(10):
    Data.append(r.randint(1,100))
# 함수
def bubbleSort(list) :
    count = 0
    count2 = 0
    sortedList = list
    for i in range(len(list)-1, 0, -1):
        count += 1
        for j in range(i):
            if sortedList[j] > sortedList[j+1]:
                count2 += 1
                a = sortedList[j+1]
                sortedList[j+1] = sortedList[j]
                sortedList[j] = a
                print(count2, sortedList)
                
    print("%d "%(count))
bubbleSort(Data)