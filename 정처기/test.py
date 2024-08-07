sample_input_list = [[1,1,1,0,0,0],[0,1,0,0,0,0],[1,1,1,0,0,0],[0,0,2,4,4,0],[0,0,0,2,0,0],[0,0,1,2,4,0]]
pattern_size = 3
def hourglassSum(size, arr):
    pattern_size = size
    sample_size = len(arr[0])
    mkf = sample_size - pattern_size + 1
    max_sum = 0
    
    dy = [-1,-1,-1,0,1,1,1]
    dx = [-1,0,1,0,-1,0,1]
    for i in range(mkf):
        for j in range(mkf):
            sum = 0
            for dir in range(len(dy)):
                y = i + dy[dir]
                x = j + dx[dir]
                if dir == 3:
                    sum += arr[i][j]
                else:
                    sum += arr[y][x]
            if sum > max_sum:
                max_sum = sum
    print(max_sum)
    
    
hourglassSum(pattern_size ,sample_input_list)
