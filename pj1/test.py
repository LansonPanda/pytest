import random
import psutil
# 2차 수정

def generate_lotto_numbers(num_draws=10000):
    lotto_numbers_list = []

    for _ in range(num_draws):
        # 번호 추첨
        lotto_numbers = random.sample(range(1, 46), 6)
        lotto_numbers.sort()
        lotto_numbers_list.append((lotto_numbers))

    return lotto_numbers_list

# 10000개의 번호 추첨

# 결과 확인
for i, (lotto_numbers) in enumerate(generate_lotto_numbers()):
    print(f'{i+1}번째 번호: {lotto_numbers}')
