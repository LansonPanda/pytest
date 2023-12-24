import random
import psutil

def generate_lotto_numbers_with_cpu_usage(num_draws=10000):
    lotto_numbers_list = []

    for _ in range(num_draws):
        # CPU 사용량 출력
        cpu_usage = psutil.cpu_percent()

        # 로또 번호 추첨
        lotto_numbers = random.sample(range(1, 46), 6)
        lotto_numbers.sort()
        lotto_numbers_list.append((lotto_numbers, cpu_usage))

    return lotto_numbers_list

# 10000개의 로또 번호 추첨 및 CPU 사용량 출력
lotto_results_with_cpu = generate_lotto_numbers_with_cpu_usage()

# 결과 확인
for idx, (numbers, cpu_usage) in enumerate(lotto_results_with_cpu[:10]):  # 처음 10개만 출력
    print(f"Draw {idx + 1}: {numbers}, CPU Usage: {cpu_usage}%")
