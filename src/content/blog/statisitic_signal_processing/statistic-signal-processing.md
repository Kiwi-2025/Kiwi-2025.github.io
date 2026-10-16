---
title:  Statistic Signal Processing Note-1
date: 2026-08-07 09:46:05
categories:
- Notes
tags:
- Statistic
- Mathematics
featured: true
description: Based on Steven M. Kay's Fundamentals of Statistical Signal Processing, Volume I
---

## Estimation

### Minimum Variance Criterion

最小化平方误差损失函数 mse, 可以展开为统计机器学习中经典的 bias-variance tradeoff（偏差-方差权衡）

$$
mse(\hat{\theta}) = \mathbb{E}\left[(\hat{\theta} - \theta)^2\right] = \mathbb{E}\left[(\hat{\theta} - \mathbb{E}[\hat{\theta}] + \mathbb{E}[\hat{\theta}] - \theta)^2\right]
\\= \mathbb{E}\left[(\hat{\theta} - \mathbb{E}[\hat{\theta}])^2\right] + \left(\mathbb{E}[\hat{\theta}] - \theta\right)^2 = \text{Var}(\hat{\theta}) + \text{Bias}^2(\hat{\theta})
$$

一般根据 MSE 准则得到的最优估计器是无法实现的，通常他们涉及到未知的参数 $\theta$，在一些个别情况下可以实现这个 mse 最优估计器。

### Minimum Variance Unbiased Estimator (MVU)

因为大多数情况下找不到 mse 最优估计器，我们假设能够找到一个无偏估计器，进而只需要找到一个最小方差的无偏估计器，这就是最小方差无偏估计器（MVU）。

遗憾的是，MVU也不总是存在，有些时候你就是无法找到一个无偏估计器在 mse 意义下是最优的。在一些很坏的情况下，甚至连无偏估计器都找不到。

更糟糕的是，就算已知 MVU 是存在的，还是没有一个能够通用的算法计算求解。

三种常用的求解方法分别是：
- Cramer-Rao Lower Bound (CRLB)
- Rao-Blackwell-Lehmann-Scheffe Theorem
- 进一步缩窄到线性估计器中求解

其中 CRLB 方法通过先找到一个下界，然后再找到一个无偏估计器达到这个下界，来证明这个无偏估计器是最优的。RBLS方法先找到充分统计量，然后对数据的 PDF 做限制最后得到MVU的估计。