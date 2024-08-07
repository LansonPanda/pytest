data = [5, 10, 21, 29, 32, 35, 44, 46, 52, 55, 57, 60, 66, 68, 72, 75]
key = 75

def binarySort(a, b):
    # 개수가 홀수인지?  
    if (a + b)/2 % 2 == 0: # 홀수 일때
        start, middle, end = a, int((a+b)/2), b
        
        if data[middle] < key:
            binarySort(start, middle)
        
        elif data[middle] > key:
            binarySort(middle, end)
            
        elif data[middle] == key:
            return middle
    
    else:
        start, middle, end = a, (a+b)/2, b
        
        
print(binarySort(0, len(data)))